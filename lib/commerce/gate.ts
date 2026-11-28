/** HTTP checkout stays closed in this preview, even if PayPal credentials are present. */
export const PAYMENTS_OPEN = false;

export function refuseCollection(action: string): { ok: false; code: "payments_closed"; paid: false } | null {
  if (PAYMENTS_OPEN) return null;
  if (action === "create" || action === "capture" || action === "mock") {
    return { ok: false, code: "payments_closed", paid: false };
  }
  return null;
}
