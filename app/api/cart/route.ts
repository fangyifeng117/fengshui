import { nextCartLines, publicCartPayload, quoteCart, type ServerCart } from "@/lib/cart";
import { products } from "@/lib/catalog";
import { isCrossSite, readCartDocument, writeCartDocument } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function quoted(cart: ServerCart) {
  const id = cart.id === "cart_cookie" ? null : cart.id;
  return publicCartPayload(quoteCart(products, cart), id, cart.version);
}

export async function GET() {
  const cart = await readCartDocument();
  return Response.json(quoted(cart));
}

export async function POST(request: Request) {
  if (isCrossSite(request)) return Response.json({ ok: false, code: "cross_site" }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { productId?: string; quantity?: number } | null;
  if (!body?.productId) return Response.json({ ok: false, code: "invalid_body" }, { status: 400 });
  const current = await readCartDocument();
  try {
    const lines = nextCartLines(current.lines, body.productId, body.quantity ?? 1, products);
    const cart = {
      id: current.id === "cart_cookie" ? `cart_${crypto.randomUUID()}` : current.id,
      version: 0,
      lines,
    };
    await writeCartDocument(cart);
    return Response.json({ ok: true, ...quoted(cart) });
  } catch (error) {
    const code = error instanceof Error ? error.message : "cart_error";
    return Response.json({ ok: false, code }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  if (isCrossSite(request)) return Response.json({ ok: false, code: "cross_site" }, { status: 403 });
  const current = await readCartDocument();
  if (current.id === "cart_cookie" && current.lines.length === 0) {
    return Response.json({ ok: false, code: "empty_cart" }, { status: 400 });
  }
  const body = (await request.json().catch(() => null)) as { productId?: string; quantity?: number } | null;
  if (!body?.productId || body.quantity == null) {
    return Response.json({ ok: false, code: "invalid_body" }, { status: 400 });
  }
  if (!Number.isInteger(body.quantity) || body.quantity < 0 || body.quantity > 9) {
    return Response.json({ ok: false, code: "invalid_quantity" }, { status: 400 });
  }
  const lines =
    body.quantity === 0
      ? current.lines.filter((line) => line.productId !== body.productId)
      : current.lines.map((line) =>
          line.productId === body.productId ? { ...line, quantity: body.quantity as number } : line,
        );
  const cart = { ...current, lines };
  await writeCartDocument(cart);
  return Response.json({ ok: true, ...quoted(cart) });
}
