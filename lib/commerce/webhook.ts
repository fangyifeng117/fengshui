import type { AppDatabase } from "@/lib/db";
import type { PayPalGateway } from "@/lib/paypal/client";
import { PayPalModeError, resolvePayPalMode } from "@/lib/paypal/mode";
import {
  parseApprovedResource,
  parseCaptureResource,
  parseWebhookEvent,
  redactPayPalPayload,
} from "@/lib/paypal/payload";
import { applyVerifiedApproval, applyVerifiedCapture, recordIgnoredVerifiedEvent } from "@/lib/commerce/fulfill";

const CAPTURE_EVENTS = new Set([
  "PAYMENT.CAPTURE.COMPLETED",
  "PAYMENT.CAPTURE.DENIED",
  "PAYMENT.CAPTURE.PENDING",
  "PAYMENT.CAPTURE.REFUNDED",
]);

export type WebhookResponse = {
  httpStatus: number;
  body: Record<string, unknown>;
};

function header(headers: Headers, name: string): string {
  return headers.get(name)?.trim() ?? "";
}

export async function handlePayPalWebhook(
  db: AppDatabase,
  input: {
    headers: Headers;
    event: unknown;
    paypal: PayPalGateway | null;
    webhookId: string;
    nodeEnv: string;
    modeSetting: string | undefined;
  },
): Promise<WebhookResponse> {
  try {
    resolvePayPalMode(input.modeSetting, input.nodeEnv);
  } catch (error) {
    if (error instanceof PayPalModeError) {
      return { httpStatus: 403, body: { ok: false, code: error.code } };
    }
    throw error;
  }

  if (!input.paypal?.configured || !input.webhookId) {
    return { httpStatus: 400, body: { ok: false, code: "unverified", fulfilled: false } };
  }

  const transmissionId = header(input.headers, "paypal-transmission-id");
  const transmissionTime = header(input.headers, "paypal-transmission-time");
  const transmissionSig = header(input.headers, "paypal-transmission-sig");
  const certUrl = header(input.headers, "paypal-cert-url");
  const authAlgo = header(input.headers, "paypal-auth-algo");

  let verificationStatus = "FAILURE";
  try {
    const verification = await input.paypal.verifyWebhookSignature({
      authAlgo,
      certUrl,
      transmissionId,
      transmissionSig,
      transmissionTime,
      webhookId: input.webhookId,
      event: input.event,
    });
    verificationStatus = verification.verification_status;
  } catch {
    return { httpStatus: 400, body: { ok: false, code: "unverified", fulfilled: false } };
  }

  if (verificationStatus !== "SUCCESS") {
    return { httpStatus: 400, body: { ok: false, code: "invalid_signature", fulfilled: false } };
  }

  const parsed = parseWebhookEvent(input.event);
  if (!parsed) {
    return { httpStatus: 400, body: { ok: false, code: "invalid_event", fulfilled: false } };
  }

  const safePayload = redactPayPalPayload(input.event);

  if (parsed.eventType === "CHECKOUT.ORDER.APPROVED") {
    const approved = parseApprovedResource(parsed.resource);
    const result = applyVerifiedApproval(db, {
      verified: true,
      eventId: parsed.id,
      eventType: parsed.eventType,
      orderId: approved.customId,
      paypalOrderId: approved.paypalOrderId,
      amountCents: approved.amountCents,
      currency: approved.currency,
      payload: safePayload,
    });
    return {
      httpStatus: result.httpStatus,
      body: { ok: true, code: result.reason, fulfilled: false, duplicate: result.duplicate },
    };
  }

  if (CAPTURE_EVENTS.has(parsed.eventType)) {
    const capture = parseCaptureResource(parsed.resource);
    if (!capture.captureId) {
      return { httpStatus: 400, body: { ok: false, code: "invalid_event", fulfilled: false } };
    }
    const result = applyVerifiedCapture(db, {
      verified: true,
      eventId: parsed.id,
      eventType: parsed.eventType,
      orderId: capture.customId,
      paypalOrderId: capture.paypalOrderId,
      captureId: capture.captureId,
      captureStatus: capture.captureStatus ?? "UNKNOWN",
      amountCents: capture.amountCents,
      currency: capture.currency,
      payload: safePayload,
    });
    return {
      httpStatus: result.httpStatus,
      body: {
        ok: result.httpStatus < 500,
        code: result.reason,
        fulfilled: result.fulfilled,
        duplicate: result.duplicate,
      },
    };
  }

  const ignored = recordIgnoredVerifiedEvent(db, {
    eventId: parsed.id,
    eventType: parsed.eventType,
    payload: safePayload,
  });
  return {
    httpStatus: ignored.httpStatus,
    body: { ok: true, code: ignored.reason, fulfilled: false, duplicate: ignored.duplicate },
  };
}
