import { paypalApiBase, resolvePayPalMode } from "@/lib/paypal/mode";
import { readServerEnv } from "@/lib/server-config";

export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export type PayPalGateway = {
  configured: boolean;
  mode: "sandbox" | "live";
  webhookId: string;
  createOrder: (input: { requestId: string; body: unknown }) => Promise<{ id: string; status: string; raw: unknown }>;
  captureOrder: (input: { requestId: string; paypalOrderId: string }) => Promise<unknown>;
  verifyWebhookSignature: (input: {
    authAlgo: string;
    certUrl: string;
    transmissionId: string;
    transmissionSig: string;
    transmissionTime: string;
    webhookId: string;
    event: unknown;
  }) => Promise<{ verification_status: string }>;
};

type ClientOptions = {
  mode: "sandbox" | "live";
  clientId: string;
  clientSecret: string;
  webhookId: string;
  fetchImpl?: FetchLike;
  apiBase?: string;
};

export class PayPalRequestError extends Error {
  status: number;
  paypalName: string;

  constructor(status: number, paypalName: string) {
    super(`paypal_${paypalName || "request_failed"}`);
    this.status = status;
    this.paypalName = paypalName;
  }
}

export function createPayPalClient(options: ClientOptions): PayPalGateway {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiBase = options.apiBase ?? paypalApiBase(options.mode);
  const configured = Boolean(options.clientId && options.clientSecret);
  let token: { value: string; expiresAt: number } | null = null;

  async function accessToken(): Promise<string> {
    if (token && token.expiresAt > Date.now() + 15_000) return token.value;
    const auth = Buffer.from(`${options.clientId}:${options.clientSecret}`).toString("base64");
    const response = await fetchImpl(`${apiBase}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const json = (await response.json().catch(() => ({}))) as { access_token?: string; expires_in?: number };
    if (!response.ok || !json.access_token) {
      throw new PayPalRequestError(response.status, "oauth_failed");
    }
    token = {
      value: json.access_token,
      expiresAt: Date.now() + (json.expires_in ?? 300) * 1000,
    };
    return json.access_token;
  }

  async function postJson(url: string, requestId: string | null, body: unknown): Promise<unknown> {
    const bearer = await accessToken();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };
    if (requestId) headers["PayPal-Request-Id"] = requestId;
    const response = await fetchImpl(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body ?? {}),
    });
    const json = (await response.json().catch(() => ({}))) as { name?: string; id?: string; status?: string };
    if (!response.ok) {
      throw new PayPalRequestError(response.status, json.name || "request_failed");
    }
    return json;
  }

  return {
    configured,
    mode: options.mode,
    webhookId: options.webhookId,
    async createOrder(input) {
      const raw = (await postJson(`${apiBase}/v2/checkout/orders`, input.requestId, input.body)) as {
        id?: string;
        status?: string;
      };
      if (!raw.id) throw new PayPalRequestError(502, "missing_order_id");
      return { id: raw.id, status: raw.status ?? "CREATED", raw };
    },
    async captureOrder(input) {
      return postJson(
        `${apiBase}/v2/checkout/orders/${encodeURIComponent(input.paypalOrderId)}/capture`,
        input.requestId,
        {},
      );
    },
    async verifyWebhookSignature(input) {
      const raw = (await postJson(`${apiBase}/v1/notifications/verify-webhook-signature`, null, {
        auth_algo: input.authAlgo,
        cert_url: input.certUrl,
        transmission_id: input.transmissionId,
        transmission_sig: input.transmissionSig,
        transmission_time: input.transmissionTime,
        webhook_id: input.webhookId,
        webhook_event: input.event,
      })) as { verification_status?: string };
      return { verification_status: raw.verification_status ?? "FAILURE" };
    },
  };
}

export function createPayPalClientFromEnv(env: NodeJS.ProcessEnv = process.env): PayPalGateway {
  const server = readServerEnv(env);
  const mode = resolvePayPalMode(server.paypalMode, server.nodeEnv);
  return createPayPalClient({
    mode,
    clientId: server.paypalClientId,
    clientSecret: server.paypalClientSecret,
    webhookId: server.paypalWebhookId,
  });
}
