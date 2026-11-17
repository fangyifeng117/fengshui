export type ServerEnv = {
  paypalMode: string | undefined;
  paypalClientId: string;
  paypalClientSecret: string;
  paypalWebhookId: string;
  nodeEnv: string;
  databasePath: string;
  paypalConfigured: boolean;
};

export function readServerEnv(env: NodeJS.ProcessEnv = process.env): ServerEnv {
  const paypalClientId = env.PAYPAL_CLIENT_ID?.trim() ?? "";
  const paypalClientSecret = env.PAYPAL_CLIENT_SECRET?.trim() ?? "";
  return {
    paypalMode: env.PAYPAL_MODE,
    paypalClientId,
    paypalClientSecret,
    paypalWebhookId: env.PAYPAL_WEBHOOK_ID?.trim() ?? "",
    nodeEnv: env.NODE_ENV ?? "development",
    databasePath: env.DATABASE_PATH?.trim() ?? "",
    paypalConfigured: Boolean(paypalClientId && paypalClientSecret),
  };
}
