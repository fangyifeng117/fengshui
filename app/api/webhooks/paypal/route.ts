import { PAYMENTS_OPEN } from "@/lib/commerce/gate";
import { handlePayPalWebhook } from "@/lib/commerce/webhook";
import { getDb } from "@/lib/db";
import { createPayPalClientFromEnv } from "@/lib/paypal/client";
import { PayPalModeError } from "@/lib/paypal/mode";
import { readServerEnv } from "@/lib/server-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!PAYMENTS_OPEN) {
    return Response.json({ ok: false, code: "payments_closed", fulfilled: false, paid: false }, { status: 403 });
  }
  const raw = await request.text();
  if (raw.length > 1_000_000) {
    return Response.json({ ok: false, code: "payload_too_large", fulfilled: false }, { status: 413 });
  }
  let event: unknown;
  try {
    event = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, code: "invalid_json", fulfilled: false }, { status: 400 });
  }
  const env = readServerEnv();
  let paypal = null;
  if (env.paypalConfigured && env.paypalWebhookId) {
    try {
      paypal = createPayPalClientFromEnv();
    } catch (error) {
      if (error instanceof PayPalModeError) {
        return Response.json({ ok: false, code: error.code, fulfilled: false }, { status: 403 });
      }
      throw error;
    }
  }
  const result = await handlePayPalWebhook(getDb(), {
    headers: request.headers,
    event,
    paypal,
    webhookId: env.paypalWebhookId,
    nodeEnv: env.nodeEnv,
    modeSetting: env.paypalMode,
  });
  return Response.json(result.body, { status: result.httpStatus });
}
