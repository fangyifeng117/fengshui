import { ProductCard } from "@/components/ProductCard";
import { filterProducts, getCollections, getProducts } from "@/lib/catalog";
import { displayCollectionTitle, displayDescription, displayTitle } from "@/lib/i18n/display";
import { copy } from "@/lib/i18n/messages";
import { asLocale, hrefFor } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({
    title: text.shop.title,
    description: "Sample jewelry and decorative objects with illustrative USD prices.",
    path: "/products",
    locale,
  });
}

function one(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = asLocale((await params).locale);
  const text = copy(locale);
  const query = await searchParams;
  const collection = one(query.collection);
  const q = one(query.q);
  const underRaw = one(query.under);
  const underDollars = underRaw ? Number(underRaw) : undefined;
  const catalog = getProducts();
  const filtered = filterProducts(catalog, {
    collection,
    q,
    underDollars: underDollars != null && Number.isFinite(underDollars) ? underDollars : undefined,
  });
  const visible =
    locale === "zh" && q
      ? catalog.filter((product) => {
          if (collection && product.collection !== collection) return false;
          if (underDollars != null && Number.isFinite(underDollars) && underDollars > 0 && product.price > Math.round(underDollars * 100)) {
            return false;
          }
          const haystack = `${displayTitle(product, "zh")} ${displayDescription(product, "zh")}`;
          return haystack.toLowerCase().includes(q.trim().toLowerCase()) || filtered.some((item) => item.id === product.id);
        })
      : filtered;
  const collections = getCollections();

  return (
    <div className="page">
      <header className="section-head">
        <h1>{text.shop.title}</h1>
      </header>
      <form className="filters" action={hrefFor(locale, "/products")} method="get">
        <label>
          {text.shop.collection}
          <select name="collection" defaultValue={collection}>
            <option value="">{text.shop.allCollections}</option>
            {collections.map((item) => (
              <option key={item.slug} value={item.slug}>
                {displayCollectionTitle(item, locale)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {text.shop.search}
          <input name="q" defaultValue={q} placeholder={text.shop.searchPlaceholder} />
        </label>
        <label>
          {text.shop.price}
          <select name="under" defaultValue={underRaw}>
            <option value="">{text.shop.anyPrice}</option>
            <option value="30">$30</option>
            <option value="40">$40</option>
            <option value="60">$60</option>
          </select>
        </label>
        <button className="button" type="submit">
          {text.shop.apply}
        </button>
      </form>
      {visible.length === 0 ? (
        <p className="empty">{text.shop.empty}</p>
      ) : (
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
