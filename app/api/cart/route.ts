import { products } from "@/lib/catalog";
import { addToCart, quoteCart, readCart, setCartQuantity } from "@/lib/cart";
import { getDb } from "@/lib/db";
import { ensureCartId, existingCartId, isCrossSite } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cartId = await existingCartId();
  if (!cartId) {
    return Response.json({ id: null, version: 0, items: [], amountCents: 0, currency: "USD" });
  }
  const cart = readCart(getDb(), cartId);
  const quote = quoteCart(products, cart);
  return Response.json({ id: cart.id, version: cart.version, ...quote });
}

export async function POST(request: Request) {
  if (isCrossSite(request)) return Response.json({ ok: false, code: "cross_site" }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { productId?: string; quantity?: number } | null;
  if (!body?.productId) return Response.json({ ok: false, code: "invalid_body" }, { status: 400 });
  try {
    const cartId = await ensureCartId();
    const cart = addToCart(getDb(), cartId, body.productId, body.quantity ?? 1, products);
    const quote = quoteCart(products, cart);
    return Response.json({ ok: true, id: cart.id, version: cart.version, ...quote });
  } catch (error) {
    const code = error instanceof Error ? error.message : "cart_error";
    return Response.json({ ok: false, code }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (isCrossSite(request)) return Response.json({ ok: false, code: "cross_site" }, { status: 403 });
  const cartId = await existingCartId();
  if (!cartId) return Response.json({ ok: false, code: "empty_cart" }, { status: 400 });
  const body = (await request.json().catch(() => null)) as { productId?: string; quantity?: number } | null;
  if (!body?.productId || body.quantity == null) {
    return Response.json({ ok: false, code: "invalid_body" }, { status: 400 });
  }
  try {
    const cart = setCartQuantity(getDb(), cartId, body.productId, body.quantity);
    const quote = quoteCart(products, cart);
    return Response.json({ ok: true, id: cart.id, version: cart.version, ...quote });
  } catch (error) {
    const code = error instanceof Error ? error.message : "cart_error";
    return Response.json({ ok: false, code }, { status: 400 });
  }
}
