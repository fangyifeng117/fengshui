import { presentOrder } from "@/lib/commerce/present";
import { getOrder } from "@/lib/commerce/orders";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const order = getOrder(getDb(), id);
  const view = presentOrder(order, {});
  if (!view.found) return Response.json({ ok: false, code: "not_found" }, { status: 404 });
  return Response.json({
    ok: true,
    id: order?.id,
    status: view.status,
    paid: view.paid,
    mock: view.mock,
    mode: view.mode,
    items: view.items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
    })),
  });
}
