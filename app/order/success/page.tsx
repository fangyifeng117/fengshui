import Link from "next/link";
import { OrderStatusPanel } from "@/components/OrderStatusPanel";
import { presentOrder } from "@/lib/commerce/present";
import { getOrder } from "@/lib/commerce/orders";
import { getDb } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Order status",
  description: "Server-verified order status. A return URL is not proof of payment.",
  path: "/order/success",
});

function queryMap(params: Record<string, string | string[] | undefined>): Record<string, string | undefined> {
  const output: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    output[key] = Array.isArray(value) ? value[0] : value;
  }
  return output;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = queryMap(await searchParams);
  const order = query.order ? getOrder(getDb(), query.order) : null;
  const view = presentOrder(order, query);
  const heading = view.mock ? "MOCK preview" : view.paid ? "Payment recorded" : "Not paid";
  return (
    <div className="page narrow">
      <OrderStatusPanel view={view} heading={heading} />
      <p>
        <Link href="/products">Back to samples</Link>
      </p>
    </div>
  );
}
