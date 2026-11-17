import { products } from "@/lib/catalog";
import { quoteCart, readCart } from "@/lib/cart";
import {
  assertStock,
  cancelIfUnpaid,
  capturePayPalCheckout,
  startMockDemonstration,
  startPayPalCheckout,
} from "@/lib/commerce/orders";
import { CommerceError } from "@/lib/commerce/quote";
import { getDb } from "@/lib/db";
import { createPayPalClientFromEnv } from "@/lib/paypal/client";
import { PayPalModeError } from "@/lib/paypal/mode";
import { existingCartId, isCrossSite } from "@/lib/request";
import { readServerEnv } from "@/lib/server-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutBody = {
  action?: "create" | "capture" | "mock" | "cancel";
  orderId?: string;
  paypalOrderId?: string;
};

async function readBody(request: Request): Promise<CheckoutBody | null> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    return (await request.json().catch(() => null)) as CheckoutBody | null;
  }
  if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
    const form = await request.formData();
    const action = String(form.get("action") ?? "");
    if (action !== "create" && action !== "capture" && action !== "mock" && action !== "cancel") return null;
    return {
      action,
      orderId: String(form.get("orderId") ?? "") || undefined,
      paypalOrderId: String(form.get("paypalOrderId") ?? "") || undefined,
    };
  }
  return null;
}

export async function POST(request: Request) {
  if (isCrossSite(request)) return Response.json({ ok: false, code: "cross_site" }, { status: 403 });
  const body = await readBody(request);
  if (!body?.action) return Response.json({ ok: false, code: "invalid_body" }, { status: 400 });
  const acceptsJson = (request.headers.get("content-type") ?? "").includes("application/json");
  const env = readServerEnv();
  const db = getDb();

  try {
    if (body.action === "cancel") {
      if (!body.orderId) return Response.json({ ok: false, code: "not_found" }, { status: 404 });
      const result = cancelIfUnpaid(db, body.orderId);
      if (!acceptsJson) {
        return Response.redirect(new URL(`/order/cancel?order=${encodeURIComponent(body.orderId)}`, request.url), 303);
      }
      return Response.json(
        { ok: result.ok, code: result.code, orderId: result.order?.id ?? null, status: result.order?.status ?? null, paid: false },
        { status: result.ok ? 200 : 409 },
      );
    }

    const cartId = await existingCartId();
    if (!cartId) return Response.json({ ok: false, code: "empty_cart" }, { status: 400 });
    const cart = readCart(db, cartId);
    if (cart.lines.length === 0) return Response.json({ ok: false, code: "empty_cart" }, { status: 400 });

    if (body.action === "mock") {
      const result = startMockDemonstration(db, {
        cartId,
        cartVersion: cart.version,
        lines: cart.lines,
        catalog: products,
      });
      return Response.json({
        ok: true,
        code: "mock_demonstration",
        mock: true,
        paid: false,
        orderId: result.order?.id ?? null,
        status: result.order?.status ?? "mock_demonstration",
      });
    }

    if (body.action === "create") {
      const quote = quoteCart(products, cart);
      if (!quote.demoBlocked) assertStock(db, quote.items);
      let paypal = null;
      if (env.paypalConfigured) {
        paypal = createPayPalClientFromEnv();
      }
      const result = await startPayPalCheckout(db, {
        cartId,
        cartVersion: cart.version,
        lines: cart.lines,
        catalog: products,
        paypal,
        nodeEnv: env.nodeEnv,
        modeSetting: env.paypalMode,
      });
      const status = result.code === "demo_sku_blocked" || result.code === "sandbox_not_connected" ? 409 : result.ok ? 200 : 400;
      return Response.json(
        {
          ok: result.ok,
          code: result.code,
          orderId: result.order?.id ?? null,
          paypalOrderId: result.order?.paypalOrderId ?? null,
          status: result.order?.status ?? null,
          paid: false,
          reused: Boolean(result.reused),
        },
        { status },
      );
    }

    if (body.action === "capture") {
      if (!body.orderId || !body.paypalOrderId) {
        return Response.json({ ok: false, code: "invalid_body" }, { status: 400 });
      }
      const paypal = env.paypalConfigured ? createPayPalClientFromEnv() : null;
      const result = await capturePayPalCheckout(db, {
        orderId: body.orderId,
        paypalOrderId: body.paypalOrderId,
        currentCartVersion: cart.version,
        paypal,
        nodeEnv: env.nodeEnv,
        modeSetting: env.paypalMode,
      });
      return Response.json(
        {
          ok: result.ok,
          code: result.code,
          orderId: result.order?.id ?? body.orderId,
          status: result.order?.status ?? null,
          paid: result.order?.status === "paid",
        },
        { status: result.ok ? 200 : 409 },
      );
    }

    return Response.json({ ok: false, code: "invalid_body" }, { status: 400 });
  } catch (error) {
    if (error instanceof PayPalModeError) {
      return Response.json({ ok: false, code: error.code, paid: false }, { status: 403 });
    }
    if (error instanceof CommerceError) {
      return Response.json({ ok: false, code: error.code, paid: false }, { status: 400 });
    }
    if (error instanceof Error && error.message === "insufficient_inventory") {
      return Response.json({ ok: false, code: "insufficient_inventory", paid: false }, { status: 409 });
    }
    return Response.json({ ok: false, code: "checkout_failed", paid: false }, { status: 502 });
  }
}
