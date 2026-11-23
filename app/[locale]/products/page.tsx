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
    description: text.product.pending,
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
  const catalog = getProducts();
  const filtered = filterProducts(catalog, { collection, q });
  const visible =
    locale === "zh" && q
      ? catalog.filter((product) => {
          if (collection && product.collection !== collection) return false;
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
