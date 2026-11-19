import Link from "next/link";
import { CheckoutDesk } from "@/components/CheckoutDesk";
import { quoteCart, readCart } from "@/lib/cart";
import { products } from "@/lib/catalog";
import { describeCheckout } from "@/lib/commerce/present";
import { getDb } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { copy } from "@/lib/i18n/messages";
import { asLocale, hrefFor } from "@/lib/locale";
import { existingCartId } from "@/lib/request";
import { readServerEnv } from "@/lib/server-config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({
    title: text.checkout.title,
    description: text.checkout.closed,
    path: "/checkout",
    locale,
  });
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const text = copy(locale);
  const env = readServerEnv();
  const cartId = await existingCartId();
  const cart = cartId ? readCart(getDb(), cartId) : { id: "", version: 0, lines: [] };
  const quote = quoteCart(products, cart);
  const state = describeCheckout({
    configured: env.paypalConfigured,
    demoBlocked: quote.demoBlocked,
    liveDenied: false,
    empty: quote.items.length === 0,
  });

  return (
    <div className="page narrow">
      <header className="section-head">
        <h1>{text.checkout.title}</h1>
        <p>{text.checkout.closed}</p>
      </header>
      {quote.items.length === 0 ? (
        <p className="empty">
          {text.checkout.empty} <Link href={hrefFor(locale, "/products")}>{text.checkout.browse}</Link>.
        </p>
      ) : (
        <div className="checkout-layout">
          <section className="summary">
            <h2>{text.checkout.total}</h2>
            <ul className="plain-list">
              {quote.items.map((item) => (
                <li key={item.productId}>
                  {item.title} × {item.quantity}
                  <span>{formatMoney(item.unitAmountCents * item.quantity, item.currency)}</span>
                </li>
              ))}
            </ul>
            <p className="price price-large">{formatMoney(quote.amountCents, quote.currency)}</p>
            <p className="fine">{text.checkout.shipping}</p>
          </section>
          <CheckoutDesk
            state={{
              ...state,
              buttonLabel: state.state === "payments_closed" && locale === "zh" ? "支付已关闭" : state.buttonLabel,
              detail: text.checkout.closed,
            }}
          />
        </div>
      )}
    </div>
  );
}
