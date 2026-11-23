import { refuseCollection } from "@/lib/commerce/gate";
import { cancelIfUnpaid } from "@/lib/commerce/orders";
import { CommerceError } from "@/lib/commerce/quote";
import { getDb } from "@/lib/db";
import { isCrossSite, readCartDocument } from "@/lib/request";

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

  try {
    if (body.action === "cancel") {
      if (!body.orderId) return Response.json({ ok: false, code: "not_found" }, { status: 404 });
      const result = cancelIfUnpaid(getDb(), body.orderId);
      if (!acceptsJson) {
        return Response.redirect(new URL(`/order/cancel?order=${encodeURIComponent(body.orderId)}`, request.url), 303);
      }
      return Response.json(
        { ok: result.ok, code: result.code, orderId: result.order?.id ?? null, status: result.order?.status ?? null, paid: false },
        { status: result.ok ? 200 : 409 },
      );
    }

    const cart = await readCartDocument();
    if (cart.lines.length === 0) return Response.json({ ok: false, code: "empty_cart" }, { status: 400 });

    const closed = refuseCollection(body.action);
    if (closed) return Response.json(closed, { status: 403 });

    return Response.json({ ok: false, code: "invalid_body", paid: false }, { status: 400 });
  } catch (error) {
    if (error instanceof CommerceError) {
      return Response.json({ ok: false, code: error.code, paid: false }, { status: 400 });
    }
    if (error instanceof Error && error.message === "insufficient_inventory") {
      return Response.json({ ok: false, code: "insufficient_inventory", paid: false }, { status: 409 });
    }
    return Response.json({ ok: false, code: "checkout_failed", paid: false }, { status: 502 });
  }
}
