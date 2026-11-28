import Link from "next/link";
import { OrderStatusPanel } from "@/components/OrderStatusPanel";
import { presentOrder } from "@/lib/commerce/present";
import { getOrder } from "@/lib/commerce/orders";
import { getDb } from "@/lib/db";
import { copy } from "@/lib/i18n/messages";
import { asLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    title: "Checkout cancelled",
    description: "Cancellation return. The server record decides whether an order is paid.",
    path: "/order/cancel",
    locale,
  });
}

function queryMap(params: Record<string, string | string[] | undefined>): Record<string, string | undefined> {
  const output: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    output[key] = Array.isArray(value) ? value[0] : value;
  }
  return output;
}

export default async function CancelPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = asLocale((await params).locale);
  const query = queryMap(await searchParams);
  let order = null;
  if (query.order) {
    try {
      order = getOrder(getDb(), query.order);
    } catch {
      order = null;
    }
  }
  const view = presentOrder(order, query);
  return (
    <div className="page narrow">
      <OrderStatusPanel view={view} heading="Checkout was not completed" pendingLabel={copy(locale).product.pending} />
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
