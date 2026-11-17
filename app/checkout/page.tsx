import Link from "next/link";
import { CheckoutDesk } from "@/components/CheckoutDesk";
import { quoteCart, readCart } from "@/lib/cart";
import { products } from "@/lib/catalog";
import { describeCheckout } from "@/lib/commerce/present";
import { getDb } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { PayPalModeError, resolvePayPalMode } from "@/lib/paypal/mode";
import { existingCartId } from "@/lib/request";
import { readServerEnv } from "@/lib/server-config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Checkout",
  description: "PayPal handoff only. Sandbox is not connected, and sample items cannot be captured.",
  path: "/checkout",
});

export default async function CheckoutPage() {
  const env = readServerEnv();
  const cartId = await existingCartId();
  const cart = cartId ? readCart(getDb(), cartId) : { id: "", version: 0, lines: [] };
  const quote = quoteCart(products, cart);
  let liveDenied = false;
  try {
    resolvePayPalMode(env.paypalMode, env.nodeEnv);
  } catch (error) {
    liveDenied = error instanceof PayPalModeError && error.code === "live_mode_denied";
    if (!(error instanceof PayPalModeError)) throw error;
  }
  const state = describeCheckout({
    configured: env.paypalConfigured,
    demoBlocked: quote.demoBlocked,
    liveDenied,
    empty: quote.items.length === 0,
  });

  return (
    <div className="page narrow">
      <header className="section-head">
        <p className="kicker">Checkout</p>
        <h1>Payment handoff</h1>
        <p>There is no card form on this site. The only processor path is PayPal, and it is disabled in this demo.</p>
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
            <p className="fine">Shipping — TODO, not calculated. Tax is not calculated. This is a sample item total only.</p>
          </section>
          <CheckoutDesk
            state={state}
            clientId={state.state === "ready" ? env.paypalClientId : null}
            currency="USD"
            demoBlocked={quote.demoBlocked}
          />
        </div>
      )}
    </div>
  );
}
