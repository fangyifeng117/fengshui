import type { AppDatabase } from "@/lib/db";
import { withImmediateTransaction } from "@/lib/db";
import type { StoredLine } from "@/lib/types";

export type CaptureCommand = {
  verified: true;
  eventId?: string;
  eventType?: string;
  orderId: string | null;
  paypalOrderId: string | null;
  captureId: string;
  captureStatus: string;
  amountCents: number | null;
  currency: string | null;
  payload: unknown;
};

export type ApprovalCommand = {
  verified: true;
  eventId: string;
  eventType: string;
  orderId: string | null;
  paypalOrderId: string | null;
  amountCents: number | null;
  currency: string | null;
  payload: unknown;
};

export type FulfillResult = {
  fulfilled: boolean;
  duplicate: boolean;
  reason: string;
  orderId: string | null;
  httpStatus: number;
};

type OrderRow = {
  id: string;
  kind: string;
  status: string;
  currency: string;
  amount_cents: number;
  mode: string;
  paypal_order_id: string | null;
  items_json: string;
  inventory_decremented: number;
};

function nowIso(): string {
  return new Date().toISOString();
}

function recordEvent(
  db: AppDatabase,
  input: {
    eventId?: string;
    eventType: string;
    outcome: string;
    orderId: string | null;
    payload: unknown;
  },
): void {
  if (!input.eventId) return;
  db.prepare(
    `INSERT INTO webhook_events (
      event_id, event_type, verified, outcome, order_id, payload_json, processed_at
    ) VALUES (?, ?, 1, ?, ?, ?, ?)`,
  ).run(
    input.eventId,
    input.eventType,
    input.outcome,
    input.orderId,
    JSON.stringify(input.payload ?? {}),
    nowIso(),
  );
}

function loadOrder(db: AppDatabase, id: string): OrderRow | undefined {
  return db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
}

function mismatch(order: OrderRow, command: { orderId: string | null; paypalOrderId: string | null; amountCents: number | null; currency: string | null }): string | null {
  if (!command.orderId || command.orderId !== order.id) return "metadata_mismatch";
  if (order.paypal_order_id && command.paypalOrderId && order.paypal_order_id !== command.paypalOrderId) {
    return "paypal_order_mismatch";
  }
  if (command.currency !== order.currency) return "currency_mismatch";
  if (command.amountCents == null || command.amountCents !== order.amount_cents) return "amount_mismatch";
  return null;
}

function blocked(order: OrderRow): string | null {
  if (order.kind === "mock" || order.mode === "mock" || order.status === "mock_demonstration") {
    return "mock_order";
  }
  if (order.status === "demo_blocked") return "demo_sku_blocked";
  const items = JSON.parse(order.items_json) as StoredLine[];
  if (items.some((item) => item.sample || !item.captureAllowed)) return "demo_sku_blocked";
  return null;
}

export function applyVerifiedCapture(db: AppDatabase, command: CaptureCommand): FulfillResult {
  if (command.verified !== true) {
    return { fulfilled: false, duplicate: false, reason: "unverified", orderId: null, httpStatus: 400 };
  }
  return withImmediateTransaction(db, () => {
    if (command.eventId) {
      const seen = db.prepare("SELECT event_id FROM webhook_events WHERE event_id = ?").get(command.eventId) as
        | { event_id: string }
        | undefined;
      if (seen) {
        return {
          fulfilled: false,
          duplicate: true,
          reason: "duplicate",
          orderId: command.orderId,
          httpStatus: 200,
        };
      }
    }
    if (!command.orderId) {
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType ?? "PAYMENT.CAPTURE",
        outcome: "metadata_mismatch",
        orderId: null,
        payload: command.payload,
      });
      return { fulfilled: false, duplicate: false, reason: "metadata_mismatch", orderId: null, httpStatus: 200 };
    }
    const order = loadOrder(db, command.orderId);
    if (!order) {
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType ?? "PAYMENT.CAPTURE",
        outcome: "unknown_order",
        orderId: command.orderId,
        payload: command.payload,
      });
      return {
        fulfilled: false,
        duplicate: false,
        reason: "unknown_order",
        orderId: command.orderId,
        httpStatus: 200,
      };
    }
    const block = blocked(order);
    if (block) {
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType ?? "PAYMENT.CAPTURE",
        outcome: block,
        orderId: order.id,
        payload: command.payload,
      });
      return { fulfilled: false, duplicate: false, reason: block, orderId: order.id, httpStatus: 200 };
    }
    const problem = mismatch(order, command);
    if (problem) {
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType ?? "PAYMENT.CAPTURE",
        outcome: problem,
        orderId: order.id,
        payload: command.payload,
      });
      return { fulfilled: false, duplicate: false, reason: problem, orderId: order.id, httpStatus: 200 };
    }

    const status = command.captureStatus.toUpperCase();
    if (status === "COMPLETED") {
      if (order.status === "refunded") {
        recordEvent(db, {
          eventId: command.eventId,
          eventType: command.eventType ?? "PAYMENT.CAPTURE.COMPLETED",
          outcome: "ignored_after_refund",
          orderId: order.id,
          payload: command.payload,
        });
        return { fulfilled: false, duplicate: false, reason: "ignored_after_refund", orderId: order.id, httpStatus: 200 };
      }
      const existingCapture = db.prepare("SELECT id FROM captures WHERE id = ?").get(command.captureId) as
        | { id: string }
        | undefined;
      if (existingCapture || order.inventory_decremented === 1 || order.status === "paid") {
        recordEvent(db, {
          eventId: command.eventId,
          eventType: command.eventType ?? "PAYMENT.CAPTURE.COMPLETED",
          outcome: "duplicate",
          orderId: order.id,
          payload: command.payload,
        });
        return { fulfilled: false, duplicate: true, reason: "duplicate", orderId: order.id, httpStatus: 200 };
      }
      const items = JSON.parse(order.items_json) as StoredLine[];
      for (const item of items) {
        const stock = db.prepare("SELECT quantity FROM inventory WHERE product_id = ?").get(item.productId) as
          | { quantity: number }
          | undefined;
        if (!stock || stock.quantity < item.quantity) {
          db.prepare(
            "UPDATE orders SET status = 'inventory_rejected', updated_at = ? WHERE id = ? AND status != 'paid'",
          ).run(nowIso(), order.id);
          recordEvent(db, {
            eventId: command.eventId,
            eventType: command.eventType ?? "PAYMENT.CAPTURE.COMPLETED",
            outcome: "insufficient_inventory",
            orderId: order.id,
            payload: command.payload,
          });
          return {
            fulfilled: false,
            duplicate: false,
            reason: "insufficient_inventory",
            orderId: order.id,
            httpStatus: 200,
          };
        }
      }
      db.prepare(
        `INSERT INTO captures (id, order_id, paypal_order_id, status, amount_cents, currency, raw_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        command.captureId,
        order.id,
        command.paypalOrderId,
        status,
        command.amountCents,
        command.currency,
        JSON.stringify(command.payload ?? {}),
        nowIso(),
      );
      const paid = db
        .prepare(
          `UPDATE orders
           SET status = 'paid', inventory_decremented = 1, paid_at = ?, updated_at = ?, paypal_order_id = COALESCE(paypal_order_id, ?)
           WHERE id = ? AND inventory_decremented = 0 AND status != 'paid'`,
        )
        .run(nowIso(), nowIso(), command.paypalOrderId, order.id);
      if (Number(paid.changes) !== 1) {
        throw new Error("paid_update_lost");
      }
      for (const item of items) {
        const updated = db
          .prepare(
            "UPDATE inventory SET quantity = quantity - ? WHERE product_id = ? AND quantity >= ?",
          )
          .run(item.quantity, item.productId, item.quantity);
        if (Number(updated.changes) !== 1) throw new Error("INVENTORY_RACE");
      }
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType ?? "PAYMENT.CAPTURE.COMPLETED",
        outcome: "paid",
        orderId: order.id,
        payload: command.payload,
      });
      return { fulfilled: true, duplicate: false, reason: "paid", orderId: order.id, httpStatus: 200 };
    }

    if (status === "PENDING") {
      if (order.status !== "paid" && order.status !== "refunded" && order.status !== "denied") {
        db.prepare("UPDATE orders SET status = 'pending', updated_at = ? WHERE id = ? AND status != 'paid'").run(
          nowIso(),
          order.id,
        );
      }
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType ?? "PAYMENT.CAPTURE.PENDING",
        outcome: "pending",
        orderId: order.id,
        payload: command.payload,
      });
      return { fulfilled: false, duplicate: false, reason: "pending", orderId: order.id, httpStatus: 200 };
    }

    if (status === "DENIED" || status === "DECLINED") {
      if (order.status !== "paid" && order.status !== "refunded") {
        db.prepare("UPDATE orders SET status = 'denied', updated_at = ? WHERE id = ? AND status != 'paid'").run(
          nowIso(),
          order.id,
        );
      }
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType ?? "PAYMENT.CAPTURE.DENIED",
        outcome: "denied",
        orderId: order.id,
        payload: command.payload,
      });
      return { fulfilled: false, duplicate: false, reason: "denied", orderId: order.id, httpStatus: 200 };
    }

    if (status === "REFUNDED") {
      db.prepare(
        "UPDATE orders SET status = 'refunded', updated_at = ? WHERE id = ? AND status != 'demo_blocked'",
      ).run(nowIso(), order.id);
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType ?? "PAYMENT.CAPTURE.REFUNDED",
        outcome: "refunded_recorded",
        orderId: order.id,
        payload: command.payload,
      });
      return { fulfilled: false, duplicate: false, reason: "refunded_recorded", orderId: order.id, httpStatus: 200 };
    }

    recordEvent(db, {
      eventId: command.eventId,
      eventType: command.eventType ?? "PAYMENT.CAPTURE",
      outcome: "ignored_status",
      orderId: order.id,
      payload: command.payload,
    });
    return { fulfilled: false, duplicate: false, reason: "ignored_status", orderId: order.id, httpStatus: 200 };
  });
}

export function applyVerifiedApproval(db: AppDatabase, command: ApprovalCommand): FulfillResult {
  if (command.verified !== true) {
    return { fulfilled: false, duplicate: false, reason: "unverified", orderId: null, httpStatus: 400 };
  }
  return withImmediateTransaction(db, () => {
    const seen = db.prepare("SELECT event_id FROM webhook_events WHERE event_id = ?").get(command.eventId) as
      | { event_id: string }
      | undefined;
    if (seen) {
      return { fulfilled: false, duplicate: true, reason: "duplicate", orderId: command.orderId, httpStatus: 200 };
    }
    if (!command.orderId) {
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType,
        outcome: "metadata_mismatch",
        orderId: null,
        payload: command.payload,
      });
      return { fulfilled: false, duplicate: false, reason: "metadata_mismatch", orderId: null, httpStatus: 200 };
    }
    const order = loadOrder(db, command.orderId);
    if (!order) {
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType,
        outcome: "unknown_order",
        orderId: command.orderId,
        payload: command.payload,
      });
      return { fulfilled: false, duplicate: false, reason: "unknown_order", orderId: command.orderId, httpStatus: 200 };
    }
    const block = blocked(order);
    if (block) {
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType,
        outcome: block,
        orderId: order.id,
        payload: command.payload,
      });
      return { fulfilled: false, duplicate: false, reason: block, orderId: order.id, httpStatus: 200 };
    }
    const problem = mismatch(order, command);
    if (problem) {
      recordEvent(db, {
        eventId: command.eventId,
        eventType: command.eventType,
        outcome: problem,
        orderId: order.id,
        payload: command.payload,
      });
      return { fulfilled: false, duplicate: false, reason: problem, orderId: order.id, httpStatus: 200 };
    }
    if (order.status === "paypal_created" || order.status === "creating") {
      db.prepare(
        `UPDATE orders
         SET status = 'approved', paypal_order_id = COALESCE(paypal_order_id, ?), updated_at = ?
         WHERE id = ? AND status IN ('paypal_created', 'creating')`,
      ).run(command.paypalOrderId, nowIso(), order.id);
    }
    recordEvent(db, {
      eventId: command.eventId,
      eventType: command.eventType,
      outcome: "approved",
      orderId: order.id,
      payload: command.payload,
    });
    return { fulfilled: false, duplicate: false, reason: "approved", orderId: order.id, httpStatus: 200 };
  });
}

export function recordIgnoredVerifiedEvent(
  db: AppDatabase,
  input: { eventId: string; eventType: string; payload: unknown },
): FulfillResult {
  return withImmediateTransaction(db, () => {
    const seen = db.prepare("SELECT event_id FROM webhook_events WHERE event_id = ?").get(input.eventId) as
      | { event_id: string }
      | undefined;
    if (seen) {
      return { fulfilled: false, duplicate: true, reason: "duplicate", orderId: null, httpStatus: 200 };
    }
    recordEvent(db, {
      eventId: input.eventId,
      eventType: input.eventType,
      outcome: "ignored_event",
      orderId: null,
      payload: input.payload,
    });
    return { fulfilled: false, duplicate: false, reason: "ignored_event", orderId: null, httpStatus: 200 };
  });
}
