import Link from "next/link";
import { CheckoutDesk } from "@/components/CheckoutDesk";
import { quoteCart, readCart } from "@/lib/cart";
import { products } from "@/lib/catalog";
import { describeCheckout } from "@/lib/commerce/present";
import { getDb } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { existingCartId } from "@/lib/request";
import { readServerEnv } from "@/lib/server-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Checkout",
  description: "Test preview. Payment is off.",
  path: "/checkout",
});

export default async function CheckoutPage() {
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
        <h1>Checkout</h1>
        <p>Test preview. Payment is off.</p>
      </header>
      {quote.items.length === 0 ? (
        <p className="empty">
          The cart is empty. <Link href="/products">Browse samples</Link>.
        </p>
      ) : (
        <div className="checkout-layout">
          <section className="summary">
            <h2>Server total</h2>
            <ul className="plain-list">
              {quote.items.map((item) => (
                <li key={item.productId}>
                  {item.title} × {item.quantity}
                  <span>{formatMoney(item.unitAmountCents * item.quantity, item.currency)}</span>
                </li>
              ))}
            </ul>
            <p className="price price-large">{formatMoney(quote.amountCents, quote.currency)}</p>
            <p className="fine">Shipping and returns are drafts. Tax is not calculated.</p>
          </section>
          <CheckoutDesk state={state} />
        </div>
      )}
    </div>
  );
}
