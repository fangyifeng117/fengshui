import Link from "next/link";
import { quoteCart, readCart } from "@/lib/cart";
import { getCollections, products } from "@/lib/catalog";
import { getDb } from "@/lib/db";
import { publicConfig } from "@/lib/public-config";
import { existingCartId } from "@/lib/request";

export async function Header() {
  const collections = getCollections();
  let count = 0;
  const cartId = await existingCartId();
  if (cartId) {
    const cart = readCart(getDb(), cartId);
    count = quoteCart(products, cart).items.reduce((sum, item) => sum + item.quantity, 0);
  }

  return (
    <header className="site-header">
      {publicConfig.announcement ? <p className="announcement">{publicConfig.announcement}</p> : null}
      <div className="header-inner">
        <Link className="wordmark" href="/">
          <span>{publicConfig.brandName.replace(" — Demo", "")}</span>
          <small>Demo</small>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/products">Shop</Link>
          <details>
            <summary>Collections</summary>
            <div className="collection-menu">
              {collections.map((collection) => (
                <Link key={collection.slug} href={`/collections/${collection.slug}`}>
                  {collection.title}
                </Link>
              ))}
            </div>
          </details>
          <Link href="/content/guide">Guide</Link>
          <Link href="/cart" data-cart-count={count}>
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}
