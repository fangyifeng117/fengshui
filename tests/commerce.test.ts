import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { products } from "@/lib/catalog";
import { describeCheckout, presentOrder } from "@/lib/commerce/present";
import { applyVerifiedCapture } from "@/lib/commerce/fulfill";
import {
  cancelIfUnpaid,
  capturePayPalCheckout,
  getOrder,
  insertStoredOrder,
  readInventory,
  startMockDemonstration,
  startPayPalCheckout,
} from "@/lib/commerce/orders";
import { quoteLines } from "@/lib/commerce/quote";
import { handlePayPalWebhook } from "@/lib/commerce/webhook";
import { createPayPalClient } from "@/lib/paypal/client";
import { payPalToCents } from "@/lib/paypal/money";
import { resolvePayPalMode } from "@/lib/paypal/mode";
import { redactPayPalPayload } from "@/lib/paypal/payload";
import { productJsonLd, robotsMetadata } from "@/lib/seo";
import { fakePayPal, paypalHeaders, seedSellable, sellable, tempDb } from "./helpers";

function captureEvent(eventId: string, orderId: string, value = "50.00", status = "COMPLETED") {
  const type =
    status === "COMPLETED"
      ? "PAYMENT.CAPTURE.COMPLETED"
      : status === "PENDING"
        ? "PAYMENT.CAPTURE.PENDING"
        : status === "REFUNDED"
          ? "PAYMENT.CAPTURE.REFUNDED"
          : "PAYMENT.CAPTURE.DENIED";
  return {
    id: eventId,
    event_type: type,
    webhook_id: "attacker-webhook",
    resource: {
      id: `CAP-${eventId}`,
      status,
      custom_id: orderId,
      amount: { currency_code: "USD", value },
      supplementary_data: { related_ids: { order_id: "PAY-1" } },
      payer: { email_address: "person@example.com", name: { given_name: "Hidden" } },
    },
  };
}

describe("server prices and demo guard", () => {
  it("prices the cart from the catalog and ignores a client amount", () => {
    const quote = quoteLines([sellable], [{ productId: sellable.id, quantity: 2, unitPriceCents: 1 }]);
    expect(quote.amountCents).toBe(10000);
    expect(quote.currency).toBe("USD");
    expect(quote.demoBlocked).toBe(false);
  });

  it("rejects genuine capture for sample catalog SKUs", async () => {
    const { db, cleanup } = tempDb();
    const paypal = fakePayPal();
    const sample = products[0];
    if (!sample) throw new Error("missing sample");
    const result = await startPayPalCheckout(db, {
      cartId: "cart-demo",
      cartVersion: 1,
      lines: [{ productId: sample.id, quantity: 1, unitPriceCents: 1 }],
      catalog: products,
      paypal: paypal.gateway,
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    expect(result.code).toBe("demo_sku_blocked");
    expect(result.order?.amountCents).toBe(sample.price);
    expect(result.order?.paypalOrderId).toBeNull();
    expect(paypal.calls.filter((call) => call.kind === "create")).toHaveLength(0);
    const capture = await capturePayPalCheckout(db, {
      orderId: result.order?.id ?? "",
      paypalOrderId: "PAY-SHOULD-NOT",
      currentCartVersion: 1,
      paypal: paypal.gateway,
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    expect(capture.code).toBe("demo_sku_blocked");
    expect(paypal.calls.filter((call) => call.kind === "capture")).toHaveLength(0);
    cleanup();
  });

  it("keeps every public product blocked from capture", () => {
    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(product.sample).toBe(true);
      expect(product.captureAllowed).toBe(false);
      expect(product.currency).toBe("USD");
      expect(Number.isInteger(product.price)).toBe(true);
    }
  });
});

describe("paypal mode, connection, and retries", () => {
  it("denies live mode outside production", async () => {
    const { db, cleanup } = tempDb();
    const paypal = fakePayPal();
    expect(() => resolvePayPalMode("live", "test")).toThrow(/production/);
    const result = await startPayPalCheckout(db, {
      cartId: "cart-live",
      cartVersion: 1,
      lines: [{ productId: sellable.id, quantity: 1 }],
      catalog: [sellable],
      paypal: paypal.gateway,
      nodeEnv: "test",
      modeSetting: "live",
    });
    expect(result.code).toBe("live_mode_denied");
    expect(paypal.calls).toHaveLength(0);
    const webhook = await handlePayPalWebhook(db, {
      headers: paypalHeaders(),
      event: captureEvent("evt-live", "ord_missing"),
      paypal: paypal.gateway,
      webhookId: "WH-SERVER",
      nodeEnv: "test",
      modeSetting: "live",
    });
    expect(webhook.httpStatus).toBe(403);
    expect(paypal.calls.filter((call) => call.kind === "verify")).toHaveLength(0);
    cleanup();
  });

  it("reports sandbox not connected when credentials are absent", async () => {
    const { db, cleanup } = tempDb();
    const result = await startPayPalCheckout(db, {
      cartId: "cart-open",
      cartVersion: 1,
      lines: [{ productId: sellable.id, quantity: 1 }],
      catalog: [sellable],
      paypal: null,
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    expect(result.code).toBe("sandbox_not_connected");
    expect(result.order?.status).toBe("sandbox_not_connected");
    expect(result.order?.mode).toBe("unconfigured");
    expect(describeCheckout({ configured: false, demoBlocked: true, liveDenied: false, empty: false }).buttonLabel).toBe(
      "Sandbox not connected",
    );
    cleanup();
  });

  it("reuses the PayPal-Request-Id when a create is retried", async () => {
    const { db, cleanup } = tempDb();
    seedSellable(db);
    const paypal = fakePayPal();
    const input = {
      cartId: "cart-retry",
      cartVersion: 3,
      lines: [{ productId: sellable.id, quantity: 1 }],
      catalog: [sellable],
      paypal: paypal.gateway,
      nodeEnv: "test",
      modeSetting: "sandbox",
    };
    const first = await startPayPalCheckout(db, input);
    paypal.setInternalOrderId(first.order?.id ?? "");
    const second = await startPayPalCheckout(db, input);
    expect(second.reused).toBe(true);
    expect(second.order?.paypalOrderId).toBe(first.order?.paypalOrderId);
    db.prepare("UPDATE orders SET paypal_order_id = NULL, status = 'creating' WHERE id = ?").run(first.order?.id ?? "");
    const third = await startPayPalCheckout(db, input);
    const creates = paypal.calls.filter((call) => call.kind === "create");
    expect(creates).toHaveLength(2);
    expect(creates[0]?.requestId).toBe(creates[1]?.requestId);
    expect(third.order?.paypalOrderId).toBe(first.order?.paypalOrderId);
    const captured = await capturePayPalCheckout(db, {
      orderId: third.order?.id ?? "",
      paypalOrderId: third.order?.paypalOrderId ?? "",
      currentCartVersion: 3,
      paypal: paypal.gateway,
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    expect(captured.order?.status).toBe("paid");
    expect(readInventory(db, sellable.id)).toBe(4);
    db.prepare(
      "UPDATE orders SET status = 'paypal_created', inventory_decremented = 0, paid_at = NULL WHERE id = ?",
    ).run(third.order?.id ?? "");
    db.prepare("DELETE FROM captures").run();
    seedInventoryAgain(db);
    const retried = await capturePayPalCheckout(db, {
      orderId: third.order?.id ?? "",
      paypalOrderId: third.order?.paypalOrderId ?? "",
      currentCartVersion: 3,
      paypal: paypal.gateway,
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    const captureCalls = paypal.calls.filter((call) => call.kind === "capture");
    expect(captureCalls).toHaveLength(2);
    expect(captureCalls[0]?.requestId).toBe(captureCalls[1]?.requestId);
    expect(retried.order?.status).toBe("paid");
    expect(readInventory(db, sellable.id)).toBe(4);
    cleanup();
  });
});

function seedInventoryAgain(db: ReturnType<typeof tempDb>["db"]): void {
  db.prepare("UPDATE inventory SET quantity = 5 WHERE product_id = ?").run(sellable.id);
}

describe("webhooks", () => {
  function payableOrder(db: ReturnType<typeof tempDb>["db"]) {
    seedSellable(db);
    return insertStoredOrder(db, {
      cartId: `cart-${crypto.randomUUID()}`,
      cartVersion: 1,
      kind: "paypal",
      status: "paypal_created",
      currency: "USD",
      amountCents: 5000,
      mode: "sandbox",
      items: [
        {
          productId: sellable.id,
          slug: sellable.slug,
          title: sellable.title,
          quantity: 1,
          unitAmountCents: 5000,
          currency: "USD",
          sample: false,
          captureAllowed: true,
        },
      ],
      paypalOrderId: "PAY-1",
    });
  }

  it("rejects an invalid signature and does not fulfill", async () => {
    const { db, cleanup } = tempDb();
    const order = payableOrder(db);
    const paypal = fakePayPal({ verify: () => "FAILURE" });
    const result = await handlePayPalWebhook(db, {
      headers: paypalHeaders("bad"),
      event: captureEvent("evt-bad", order.id),
      paypal: paypal.gateway,
      webhookId: "WH-SERVER",
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    expect(result.httpStatus).toBe(400);
    expect(result.body.fulfilled).toBe(false);
    expect(getOrder(db, order.id)?.status).toBe("paypal_created");
    expect(readInventory(db, sellable.id)).toBe(5);
    expect(paypal.calls[0]?.webhookId).toBe("WH-SERVER");
    cleanup();
  });

  it("applies one inventory decrement for a duplicate capture event", async () => {
    const { db, cleanup } = tempDb();
    const order = payableOrder(db);
    const paypal = fakePayPal();
    const event = captureEvent("evt-once", order.id);
    const first = await handlePayPalWebhook(db, {
      headers: paypalHeaders(),
      event,
      paypal: paypal.gateway,
      webhookId: "WH-SERVER",
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    const second = await handlePayPalWebhook(db, {
      headers: paypalHeaders(),
      event,
      paypal: paypal.gateway,
      webhookId: "WH-SERVER",
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    expect(first.body.fulfilled).toBe(true);
    expect(second.body.duplicate).toBe(true);
    expect(second.body.fulfilled).toBe(false);
    expect(getOrder(db, order.id)?.status).toBe("paid");
    expect(readInventory(db, sellable.id)).toBe(4);
    const stored = db.prepare("SELECT payload_json FROM webhook_events WHERE event_id = ?").get("evt-once") as {
      payload_json: string;
    };
    expect(stored.payload_json).not.toContain("person@example.com");
    expect(stored.payload_json).not.toContain("payer");
    cleanup();
  });

  it("does not fulfill an amount mismatch", async () => {
    const { db, cleanup } = tempDb();
    const order = payableOrder(db);
    const paypal = fakePayPal();
    const result = await handlePayPalWebhook(db, {
      headers: paypalHeaders(),
      event: captureEvent("evt-mismatch", order.id, "49.99"),
      paypal: paypal.gateway,
      webhookId: "WH-SERVER",
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    expect(result.body.code).toBe("amount_mismatch");
    expect(result.body.fulfilled).toBe(false);
    expect(getOrder(db, order.id)?.status).toBe("paypal_created");
    expect(readInventory(db, sellable.id)).toBe(5);
    cleanup();
  });

  it("leaves pending and cancelled orders unpaid", async () => {
    const { db, cleanup } = tempDb();
    const order = payableOrder(db);
    const paypal = fakePayPal();
    const pending = await handlePayPalWebhook(db, {
      headers: paypalHeaders(),
      event: captureEvent("evt-pending", order.id, "50.00", "PENDING"),
      paypal: paypal.gateway,
      webhookId: "WH-SERVER",
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    expect(pending.body.fulfilled).toBe(false);
    expect(getOrder(db, order.id)?.status).toBe("pending");
    expect(presentOrder(getOrder(db, order.id), { paid: "true", status: "COMPLETED" }).paid).toBe(false);
    const cancelled = cancelIfUnpaid(db, order.id);
    expect(cancelled.order?.status).toBe("cancelled");
    expect(presentOrder(cancelled.order, { paid: "true" }).paid).toBe(false);
    expect(readInventory(db, sellable.id)).toBe(5);
    cleanup();
  });

  it("records approval without marking the order paid", async () => {
    const { db, cleanup } = tempDb();
    const order = payableOrder(db);
    const paypal = fakePayPal();
    const result = await handlePayPalWebhook(db, {
      headers: paypalHeaders(),
      event: {
        id: "evt-approved",
        event_type: "CHECKOUT.ORDER.APPROVED",
        resource: {
          id: "PAY-1",
          purchase_units: [
            { custom_id: order.id, invoice_id: order.id, amount: { currency_code: "USD", value: "50.00" } },
          ],
        },
      },
      paypal: paypal.gateway,
      webhookId: "WH-SERVER",
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    expect(result.body.fulfilled).toBe(false);
    expect(result.body.code).toBe("approved");
    expect(getOrder(db, order.id)?.status).toBe("approved");
    expect(readInventory(db, sellable.id)).toBe(5);
    cleanup();
  });

  it("does not let a verified capture mark a mock demonstration paid", async () => {
    const { db, cleanup } = tempDb();
    const sample = products[0];
    if (!sample) throw new Error("missing sample");
    seedSellable(db);
    const mock = startMockDemonstration(db, {
      cartId: "cart-mock",
      cartVersion: 1,
      lines: [{ productId: sample.id, quantity: 1 }],
      catalog: products,
    });
    expect(mock.order?.status).toBe("mock_demonstration");
    expect(presentOrder(mock.order, { paid: "true" }).paid).toBe(false);
    const paypal = fakePayPal();
    const result = await handlePayPalWebhook(db, {
      headers: paypalHeaders(),
      event: captureEvent("evt-mock", mock.order?.id ?? "", `${(sample.price / 100).toFixed(2)}`),
      paypal: paypal.gateway,
      webhookId: "WH-SERVER",
      nodeEnv: "test",
      modeSetting: "sandbox",
    });
    expect(result.body.fulfilled).toBe(false);
    expect(getOrder(db, mock.order?.id ?? "")?.status).toBe("mock_demonstration");
    cleanup();
  });

  it("refuses an unverified capture command", () => {
    const { db, cleanup } = tempDb();
    const order = payableOrder(db);
    const result = applyVerifiedCapture(db, {
      verified: false as unknown as true,
      orderId: order.id,
      paypalOrderId: "PAY-1",
      captureId: "CAP-UNVERIFIED",
      captureStatus: "COMPLETED",
      amountCents: 5000,
      currency: "USD",
      payload: {},
    });
    expect(result.fulfilled).toBe(false);
    expect(result.reason).toBe("unverified");
    expect(readInventory(db, sellable.id)).toBe(5);
    cleanup();
  });
});

describe("paypal client and public safety", () => {
  it("posts webhook verification with the server webhook id", async () => {
    const seen: { url: string; body: string }[] = [];
    const client = createPayPalClient({
      mode: "sandbox",
      clientId: "client",
      clientSecret: "super-secret-value",
      webhookId: "WH-SERVER",
      apiBase: "https://paypal.test",
      fetchImpl: async (url, init) => {
        seen.push({ url, body: String(init?.body ?? "") });
        if (url.endsWith("/v1/oauth2/token")) {
          return new Response(JSON.stringify({ access_token: "token", expires_in: 300 }), { status: 200 });
        }
        return new Response(JSON.stringify({ verification_status: "SUCCESS", id: "PAY-1", status: "CREATED" }), {
          status: 200,
        });
      },
    });
    const event = { id: "evt-1", event_type: "PAYMENT.CAPTURE.COMPLETED" };
    const result = await client.verifyWebhookSignature({
      authAlgo: "SHA256withRSA",
      certUrl: "https://example.com/cert.pem",
      transmissionId: "id",
      transmissionSig: "sig",
      transmissionTime: "time",
      webhookId: "WH-SERVER",
      event,
    });
    expect(result.verification_status).toBe("SUCCESS");
    const verify = seen.find((call) => call.url.endsWith("/v1/notifications/verify-webhook-signature"));
    expect(verify?.body).toContain("WH-SERVER");
    expect(verify?.body).toContain("PAYMENT.CAPTURE.COMPLETED");
    expect(verify?.body).not.toContain("super-secret-value");
  });

  it("redacts payer details and rejects loose money strings", () => {
    expect(JSON.stringify(redactPayPalPayload({ payer: { email_address: "a@b.c" }, id: "1" }))).not.toContain("email");
    expect(payPalToCents("50.00")).toBe(5000);
    expect(payPalToCents("50")).toBeNull();
    expect(payPalToCents("50.0")).toBeNull();
  });

  it("ships blank env placeholders and factual product data", () => {
    const env = readFileSync(".env.example", "utf8").trim().split("\n");
    expect(env.every((line) => line.endsWith("="))).toBe(true);
    const data = productJsonLd({
      name: "Sample",
      description: "Sample listing",
      sku: "smp",
      images: [],
      price: "28.00",
      currency: "USD",
      url: "http://localhost:3000/products/sample",
      brandName: "Cultural Jewelry — Demo",
    });
    expect(JSON.stringify(data)).not.toMatch(/aggregateRating|reviewCount/i);
    expect(robotsMetadata()).toMatchObject({ index: false, follow: false });
  });
});
