import Link from "next/link";
import { CartEditor } from "@/components/CartEditor";
import { quoteCart, readCart } from "@/lib/cart";
import { getProductById, products } from "@/lib/catalog";
import { getDb } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { existingCartId } from "@/lib/request";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cart",
  description: "Sample cart. Totals use server prices. Shipping is not calculated.",
  path: "/cart",
});

export default async function CartPage() {
  const cartId = await existingCartId();
  const cart = cartId ? readCart(getDb(), cartId) : { id: "", version: 0, lines: [] };
  const quote = quoteCart(products, cart);
  const lines = quote.items.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];
    return [
      {
        productId: item.productId,
        slug: item.slug,
        title: item.title,
        quantity: item.quantity,
        unitAmountCents: item.unitAmountCents,
        currency: item.currency,
        image: product.images[0]?.src ?? "",
        imageAlt: product.images[0]?.alt ?? "",
      },
    ];
  });

  return (
    <div className="page narrow">
      <header className="section-head">
        <h1>Cart</h1>
      </header>
      {lines.length === 0 ? (
        <p className="empty">
          The cart is empty. <Link href="/products">Browse samples</Link>.
        </p>
      ) : (
        <>
          <CartEditor items={lines} />
          <aside className="summary">
            <h2>Total</h2>
            <p className="price price-large">{formatMoney(quote.amountCents, quote.currency)}</p>
            <p className="fine">Shipping and returns are drafts. This total is the sample item total only.</p>
            <Link className="button" href="/checkout">
              Continue to checkout
            </Link>
          </aside>
        </>
      )}
    </div>
  );
}
