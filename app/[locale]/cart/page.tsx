import Link from "next/link";
import { CartEditor } from "@/components/CartEditor";
import { quoteCart } from "@/lib/cart";
import { getProductById, products } from "@/lib/catalog";
import { displayTitle } from "@/lib/i18n/display";
import { copy } from "@/lib/i18n/messages";
import { asLocale, hrefFor } from "@/lib/locale";
import { readCartDocument } from "@/lib/request";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({
    title: text.cart.title,
    description: text.product.pending,
    path: "/cart",
    locale,
  });
}

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const text = copy(locale);
  const cart = await readCartDocument();
  const quote = quoteCart(products, cart);
  const lines = quote.items.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];
    return [
      {
        productId: item.productId,
        slug: item.slug,
        title: displayTitle(product, locale),
        quantity: item.quantity,
      },
    ];
  });

  return (
    <div className="page narrow">
      <header className="section-head">
        <h1>{text.cart.title}</h1>
      </header>
      {lines.length === 0 ? (
        <p className="empty">
          {text.cart.empty} <Link href={hrefFor(locale, "/products")}>{text.cart.browse}</Link>.
        </p>
      ) : (
        <>
          <CartEditor items={lines} locale={locale} />
          <aside className="summary">
            <p>{text.product.pending}</p>
          </aside>
        </>
      )}
    </div>
  );
}
