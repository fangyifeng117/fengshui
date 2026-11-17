import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { openDatabase, seedInventory, type AppDatabase } from "@/lib/db";
import type { PayPalGateway } from "@/lib/paypal/client";
import type { Product } from "@/lib/types";

export const sellable: Product = {
  id: "fixture-goods",
  slug: "fixture-goods",
  title: "Fixture goods",
  description: "Test-only item used to exercise capture rules. It is not in the public catalog.",
  price: 5000,
  currency: "USD",
  images: [{ src: "/illustrations/object.svg", alt: "Fixture illustration" }],
  collection: "fixture",
  seo: { title: "Fixture goods", description: "Test only." },
  sample: false,
  captureAllowed: true,
  illustrativeQuantity: 5,
  materials: ["fixture"],
  specs: [],
  benefits: [],
  useNotes: [],
  faq: [],
};

export function tempDb(): { db: AppDatabase; dir: string; cleanup: () => void } {
  const dir = mkdtempSync(path.join(tmpdir(), "cjd-"));
  const db = openDatabase(path.join(dir, "store.sqlite"));
  return {
    db,
    dir,
    cleanup() {
      db.close();
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

export function seedSellable(db: AppDatabase, quantity = 5): void {
  seedInventory(db, [{ productId: sellable.id, quantity }]);
}

export type PayPalCall = { kind: string; requestId?: string; body?: unknown; webhookId?: string };

export function fakePayPal(options?: {
  verify?: (input: { webhookId: string; transmissionSig: string }) => string;
  captureValue?: string;
}): {
  gateway: PayPalGateway;
  calls: PayPalCall[];
  setInternalOrderId: (id: string) => void;
} {
  const calls: PayPalCall[] = [];
  const orders = new Map<string, string>();
  const captures = new Map<string, string>();
  let seq = 1;
  let internalOrderId = "";
  const gateway: PayPalGateway = {
    configured: true,
    mode: "sandbox",
    webhookId: "WH-SERVER",
    async createOrder(input) {
      calls.push({ kind: "create", requestId: input.requestId, body: input.body });
      if (!orders.has(input.requestId)) orders.set(input.requestId, `PAY-${orders.size + 1}`);
      return { id: orders.get(input.requestId) ?? "PAY-X", status: "CREATED", raw: {} };
    },
    async captureOrder(input) {
      calls.push({ kind: "capture", requestId: input.requestId, body: { paypalOrderId: input.paypalOrderId } });
      if (!captures.has(input.requestId)) captures.set(input.requestId, `CAP-${seq++}`);
      const captureId = captures.get(input.requestId) ?? "CAP-X";
      return {
        id: input.paypalOrderId,
        status: "COMPLETED",
        purchase_units: [
          {
            custom_id: internalOrderId,
            payments: {
              captures: [
                {
                  id: captureId,
                  status: "COMPLETED",
                  custom_id: internalOrderId,
                  amount: { currency_code: "USD", value: options?.captureValue ?? "50.00" },
                },
              ],
            },
          },
        ],
      };
    },
    async verifyWebhookSignature(input) {
      calls.push({ kind: "verify", webhookId: input.webhookId, body: input.event });
      const status = options?.verify
        ? options.verify({ webhookId: input.webhookId, transmissionSig: input.transmissionSig })
        : input.transmissionSig
          ? "SUCCESS"
          : "FAILURE";
      return { verification_status: status };
    },
  };
  return {
    gateway,
    calls,
    setInternalOrderId(id: string) {
      internalOrderId = id;
    },
  };
}

export function paypalHeaders(sig = "signed"): Headers {
  return new Headers({
    "paypal-transmission-id": "transmission-1",
    "paypal-transmission-time": "2026-11-17T00:00:00Z",
    "paypal-transmission-sig": sig,
    "paypal-cert-url": "https://example.com/cert.pem",
    "paypal-auth-algo": "SHA256withRSA",
  });
}
