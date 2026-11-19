import Link from "next/link";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { quoteCart, readCart } from "@/lib/cart";
import { getCollections, products } from "@/lib/catalog";
import { getDb } from "@/lib/db";
import { displayCollectionTitle } from "@/lib/i18n/display";
import { copy } from "@/lib/i18n/messages";
import { asLocale, hrefFor, type Locale } from "@/lib/locale";
import { DEFAULT_ANNOUNCEMENT, publicConfig } from "@/lib/public-config";
import { existingCartId } from "@/lib/request";

export async function Header({ locale = "en" }: { locale?: Locale }) {
  const text = copy(asLocale(locale));
  const collections = getCollections();
  let count = 0;
  const cartId = await existingCartId();
  if (cartId) {
    const cart = readCart(getDb(), cartId);
    count = quoteCart(products, cart).items.reduce((sum, item) => sum + item.quantity, 0);
  }
  const announcement =
    publicConfig.announcement === DEFAULT_ANNOUNCEMENT ? text.announcement : publicConfig.announcement;

  return (
    <header className="site-header">
      {announcement ? <p className="announcement">{announcement}</p> : null}
      <div className="header-inner">
        <Link className="wordmark" href={hrefFor(locale, "/")}>
          <span>{publicConfig.brandName}</span>
          <small>{text.demo}</small>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href={hrefFor(locale, "/products")}>{text.nav.shop}</Link>
          <details>
            <summary>{text.nav.collections}</summary>
            <div className="collection-menu">
              {collections.map((collection) => (
                <Link key={collection.slug} href={hrefFor(locale, `/collections/${collection.slug}`)}>
                  {displayCollectionTitle(collection, locale)}
                </Link>
              ))}
            </div>
          </details>
          <Link href={hrefFor(locale, "/temples")}>{text.nav.places}</Link>
          <Link href={hrefFor(locale, "/blessing")}>{text.nav.blessing}</Link>
          <Link href={hrefFor(locale, "/content/guide")}>{text.nav.guide}</Link>
          <Link href={hrefFor(locale, "/cart")} data-cart-count={count}>
            {text.nav.cart}
            {count > 0 ? ` (${count})` : ""}
          </Link>
          <LanguageSwitch label={text.nav.language} />
        </nav>
      </div>
    </header>
  );
}
