import Link from "next/link";
import { OrderStatusPanel } from "@/components/OrderStatusPanel";
import { presentOrder } from "@/lib/commerce/present";
import { getOrder } from "@/lib/commerce/orders";
import { getDb } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Checkout cancelled",
  description: "Cancellation return. The server record decides whether an order is paid.",
  path: "/order/cancel",
});

function queryMap(params: Record<string, string | string[] | undefined>): Record<string, string | undefined> {
  const output: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    output[key] = Array.isArray(value) ? value[0] : value;
  }
  return output;
}

export default async function CancelPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = queryMap(await searchParams);
  const order = query.order ? getOrder(getDb(), query.order) : null;
  const view = presentOrder(order, query);
  return (
    <div className="page narrow">
      <OrderStatusPanel view={view} heading="Checkout was not completed" />
      {view.found && !view.paid && !view.mock ? (
        <form className="stack-form" action="/api/checkout" method="post">
          <p className="fine">
            You can record this attempt as cancelled. That action does not mark it paid, and it does not move funds.
          </p>
          <input type="hidden" name="action" value="cancel" />
          <input type="hidden" name="orderId" value={query.order ?? ""} />
          <button className="button button-ghost" type="submit">
            Record as cancelled
          </button>
        </form>
      ) : null}
      <p>
        <Link href="/cart">Return to cart</Link>
      </p>
    </div>
  );
}
