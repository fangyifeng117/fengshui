import type { AppDatabase } from "@/lib/db";
import type { PayPalGateway } from "@/lib/paypal/client";
import { resolvePayPalMode, PayPalModeError } from "@/lib/paypal/mode";
import { parseCaptureResource, redactPayPalPayload } from "@/lib/paypal/payload";
import { absoluteUrl, publicConfig } from "@/lib/public-config";
import type { OrderKind, OrderMode, OrderStatus, Product, StoredLine, StoredOrder } from "@/lib/types";
import { buildPayPalOrderBody, quoteLines, type QuoteLineInput } from "@/lib/commerce/quote";
import { applyVerifiedCapture } from "@/lib/commerce/fulfill";

type OrderRow = {
  id: string;
  cart_id: string | null;
  cart_version: number;
  kind: string;
  status: string;
  currency: string;
  amount_cents: number;
  mode: string;
  paypal_order_id: string | null;
  create_request_id: string | null;
  capture_request_id: string | null;
  items_json: string;
  inventory_decremented: number;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export function mapOrder(row: OrderRow): StoredOrder {
  return {
    id: row.id,
    cartId: row.cart_id,
    cartVersion: row.cart_version,
    kind: row.kind as OrderKind,
    status: row.status as OrderStatus,
    currency: "USD",
    amountCents: row.amount_cents,
    mode: row.mode as OrderMode,
    paypalOrderId: row.paypal_order_id,
    createRequestId: row.create_request_id,
    captureRequestId: row.capture_request_id,
    items: JSON.parse(row.items_json) as StoredLine[],
    inventoryDecremented: row.inventory_decremented === 1,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getOrder(db: AppDatabase, id: string): StoredOrder | null {
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
  return row ? mapOrder(row) : null;
}

function findByCart(
  db: AppDatabase,
  cartId: string,
  cartVersion: number,
  kind: OrderKind,
): OrderRow | undefined {
  return db
    .prepare("SELECT * FROM orders WHERE cart_id = ? AND cart_version = ? AND kind = ?")
    .get(cartId, cartVersion, kind) as OrderRow | undefined;
}

export function insertStoredOrder(
  db: AppDatabase,
  input: {
    cartId?: string | null;
    cartVersion: number;
    kind: OrderKind;
    status: OrderStatus;
    currency: "USD";
    amountCents: number;
    mode: OrderMode;
    items: StoredLine[];
    paypalOrderId?: string | null;
    createRequestId?: string | null;
    captureRequestId?: string | null;
  },
): StoredOrder {
  const now = new Date().toISOString();
  const id = `ord_${crypto.randomUUID()}`;
  try {
    db.prepare(
      `INSERT INTO orders (
        id, cart_id, cart_version, kind, status, currency, amount_cents, mode,
        paypal_order_id, create_request_id, capture_request_id, items_json,
        inventory_decremented, paid_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, ?)`,
    ).run(
      id,
      input.cartId ?? null,
      input.cartVersion,
      input.kind,
      input.status,
      input.currency,
      input.amountCents,
      input.mode,
      input.paypalOrderId ?? null,
      input.createRequestId ?? null,
      input.captureRequestId ?? null,
      JSON.stringify(input.items),
      now,
      now,
    );
  } catch (error) {
    if (input.cartId && String(error).includes("UNIQUE")) {
      const existing = findByCart(db, input.cartId, input.cartVersion, input.kind);
      if (existing) return mapOrder(existing);
    }
    throw error;
  }
  const stored = getOrder(db, id);
  if (!stored) throw new Error("order_insert_failed");
  return stored;
}

function orderContainsBlockedDemo(items: StoredLine[]): boolean {
  return items.some((item) => item.sample || !item.captureAllowed);
}

export type CheckoutResult = {
  ok: boolean;
  code: string;
  order: StoredOrder | null;
  reused?: boolean;
};

function modeOrError(modeSetting: string | undefined, nodeEnv: string): 
  | { ok: true; mode: "sandbox" | "live" }
  | { ok: false; code: string; order: null } {
  try {
    return { ok: true, mode: resolvePayPalMode(modeSetting, nodeEnv) };
  } catch (error) {
    if (error instanceof PayPalModeError) {
      return { ok: false, code: error.code, order: null };
    }
    throw error;
  }
}

export async function startPayPalCheckout(
  db: AppDatabase,
  input: {
    cartId: string;
    cartVersion: number;
    lines: QuoteLineInput[];
    catalog: Product[];
    paypal: PayPalGateway | null;
    nodeEnv: string;
    modeSetting: string | undefined;
  },
): Promise<CheckoutResult> {
  const resolved = modeOrError(input.modeSetting, input.nodeEnv);
  if (!resolved.ok) return resolved;
  const quote = quoteLines(input.catalog, input.lines);
  const existing = findByCart(db, input.cartId, input.cartVersion, "paypal");
  if (existing?.paypal_order_id) {
    return { ok: true, code: "reused", order: mapOrder(existing), reused: true };
  }

  if (quote.demoBlocked) {
    const order =
      (existing && mapOrder(existing)) ||
      insertStoredOrder(db, {
        cartId: input.cartId,
        cartVersion: input.cartVersion,
        kind: "paypal",
        status: "demo_blocked",
        currency: quote.currency,
        amountCents: quote.amountCents,
        mode: resolved.mode,
        items: quote.items,
      });
    if (order.status !== "demo_blocked") {
      db.prepare("UPDATE orders SET status = 'demo_blocked', updated_at = ? WHERE id = ?").run(
        new Date().toISOString(),
        order.id,
      );
    }
    return { ok: false, code: "demo_sku_blocked", order: getOrder(db, order.id) };
  }

  if (!input.paypal?.configured) {
    const order =
      (existing && mapOrder(existing)) ||
      insertStoredOrder(db, {
        cartId: input.cartId,
        cartVersion: input.cartVersion,
        kind: "paypal",
        status: "sandbox_not_connected",
        currency: quote.currency,
        amountCents: quote.amountCents,
        mode: "unconfigured",
        items: quote.items,
      });
    return { ok: false, code: "sandbox_not_connected", order };
  }

  const order =
    (existing && mapOrder(existing)) ||
    insertStoredOrder(db, {
      cartId: input.cartId,
      cartVersion: input.cartVersion,
      kind: "paypal",
      status: "creating",
      currency: quote.currency,
      amountCents: quote.amountCents,
      mode: resolved.mode,
      items: quote.items,
    });
  const requestId = order.createRequestId ?? `c_${order.id}_v${order.cartVersion}`;
  if (!order.createRequestId) {
    db.prepare("UPDATE orders SET create_request_id = ?, updated_at = ? WHERE id = ?").run(
      requestId,
      new Date().toISOString(),
      order.id,
    );
  }
  const remote = await input.paypal.createOrder({
    requestId,
    body: buildPayPalOrderBody({
      orderId: order.id,
      currency: quote.currency,
      amountCents: quote.amountCents,
      items: quote.items,
      brandName: publicConfig.brandName,
      returnUrl: absoluteUrl(`/order/success?order=${order.id}`),
      cancelUrl: absoluteUrl(`/order/cancel?order=${order.id}`),
    }),
  });
  db.prepare(
    "UPDATE orders SET paypal_order_id = ?, status = 'paypal_created', mode = ?, updated_at = ? WHERE id = ?",
  ).run(remote.id, resolved.mode, new Date().toISOString(), order.id);
  return { ok: true, code: "paypal_created", order: getOrder(db, order.id), reused: false };
}

export async function capturePayPalCheckout(
  db: AppDatabase,
  input: {
    orderId: string;
    paypalOrderId: string;
    currentCartVersion: number | null;
    paypal: PayPalGateway | null;
    nodeEnv: string;
    modeSetting: string | undefined;
  },
): Promise<CheckoutResult> {
  const resolved = modeOrError(input.modeSetting, input.nodeEnv);
  if (!resolved.ok) return resolved;
  const order = getOrder(db, input.orderId);
  if (!order) return { ok: false, code: "not_found", order: null };
  if (order.kind === "mock" || order.mode === "mock" || order.status === "mock_demonstration") {
    return { ok: false, code: "mock_not_payable", order };
  }
  if (order.status === "demo_blocked" || orderContainsBlockedDemo(order.items)) {
    return { ok: false, code: "demo_sku_blocked", order };
  }
  if (order.mode === "live" && resolved.mode !== "live") {
    return { ok: false, code: "live_mode_denied", order };
  }
  if (!input.paypal?.configured) {
    return { ok: false, code: "sandbox_not_connected", order };
  }
  if (order.paypalOrderId && order.paypalOrderId !== input.paypalOrderId) {
    return { ok: false, code: "paypal_order_mismatch", order };
  }
  if (
    input.currentCartVersion != null &&
    order.cartId &&
    order.cartVersion !== input.currentCartVersion
  ) {
    return { ok: false, code: "cart_changed", order };
  }
  if (order.status === "paid") {
    return { ok: true, code: "already_paid", order, reused: true };
  }
  const requestId = order.captureRequestId ?? `p_${order.id}_v${order.cartVersion}`;
  if (!order.captureRequestId) {
    db.prepare("UPDATE orders SET capture_request_id = ?, updated_at = ? WHERE id = ?").run(
      requestId,
      new Date().toISOString(),
      order.id,
    );
  }
  const remote = await input.paypal.captureOrder({
    requestId,
    paypalOrderId: input.paypalOrderId,
  });
  const parsed = parseCaptureResource(
    remote && typeof remote === "object" ? (remote as Record<string, unknown>) : {},
  );
  const captureId = parsed.captureId;
  const captureStatus = parsed.captureStatus;
  if (!captureId || !captureStatus) {
    return { ok: false, code: "paypal_capture_incomplete", order: getOrder(db, order.id) };
  }
  if (!parsed.customId || parsed.customId !== order.id) {
    return { ok: false, code: "metadata_mismatch", order: getOrder(db, order.id) };
  }
  if (parsed.paypalOrderId && parsed.paypalOrderId !== input.paypalOrderId) {
    return { ok: false, code: "paypal_order_mismatch", order: getOrder(db, order.id) };
  }
  const applied = applyVerifiedCapture(db, {
    verified: true,
    orderId: parsed.customId,
    paypalOrderId: input.paypalOrderId,
    captureId,
    captureStatus,
    amountCents: parsed.amountCents,
    currency: parsed.currency,
    payload: redactPayPalPayload(remote),
  });
  return {
    ok: applied.fulfilled || applied.reason === "duplicate",
    code: applied.reason,
    order: getOrder(db, order.id),
    reused: applied.reason === "duplicate",
  };
}

export function startMockDemonstration(
  db: AppDatabase,
  input: {
    cartId: string;
    cartVersion: number;
    lines: QuoteLineInput[];
    catalog: Product[];
  },
): CheckoutResult {
  const quote = quoteLines(input.catalog, input.lines);
  const existing = findByCart(db, input.cartId, input.cartVersion, "mock");
  if (existing) {
    const order = mapOrder(existing);
    return { ok: true, code: "mock_demonstration", order, reused: true };
  }
  const order = insertStoredOrder(db, {
    cartId: input.cartId,
    cartVersion: input.cartVersion,
    kind: "mock",
    status: "mock_demonstration",
    currency: quote.currency,
    amountCents: quote.amountCents,
    mode: "mock",
    items: quote.items,
  });
  return { ok: true, code: "mock_demonstration", order };
}

export function cancelIfUnpaid(db: AppDatabase, orderId: string): CheckoutResult {
  const order = getOrder(db, orderId);
  if (!order) return { ok: false, code: "not_found", order: null };
  if (order.status === "paid" || order.inventoryDecremented) {
    return { ok: false, code: "already_paid", order };
  }
  if (order.status === "mock_demonstration" || order.kind === "mock") {
    return { ok: true, code: "mock_unchanged", order };
  }
  db.prepare(
    `UPDATE orders
     SET status = 'cancelled', updated_at = ?
     WHERE id = ? AND status NOT IN ('paid', 'refunded') AND inventory_decremented = 0`,
  ).run(new Date().toISOString(), orderId);
  return { ok: true, code: "cancelled", order: getOrder(db, orderId) };
}

export function assertStock(db: AppDatabase, items: StoredLine[]): void {
  for (const item of items) {
    const row = db.prepare("SELECT quantity FROM inventory WHERE product_id = ?").get(item.productId) as
      | { quantity: number }
      | undefined;
    if (!row || row.quantity < item.quantity) {
      throw new Error("insufficient_inventory");
    }
  }
}

export function readInventory(db: AppDatabase, productId: string): number {
  const row = db.prepare("SELECT quantity FROM inventory WHERE product_id = ?").get(productId) as
    | { quantity: number }
    | undefined;
  return row?.quantity ?? 0;
}
