import { ProductCard } from "@/components/ProductCard";
import { filterProducts, getCollections, getProducts } from "@/lib/catalog";
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
  const filtered = filterProducts(getProducts(), {
    collection,
    q,
    underDollars: underDollars != null && Number.isFinite(underDollars) ? underDollars : undefined,
  });
  const collections = getCollections();

  return (
    <div className="page">
      <header className="section-head">
        <h1>{text.shop.title}</h1>
      </header>
      <form className="filters" action={hrefFor(locale, "/products")} method="get">
        <label>
          Collection
          <select name="collection" defaultValue={collection}>
            <option value="">All collections</option>
            {collections.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Search
          <input name="q" defaultValue={q} placeholder="Cord, bead, object" />
        </label>
        <label>
          Price up to
          <select name="under" defaultValue={underRaw}>
            <option value="">Any sample price</option>
            <option value="30">$30</option>
            <option value="40">$40</option>
            <option value="60">$60</option>
          </select>
        </label>
        <button className="button" type="submit">
          Apply
        </button>
      </form>
      {filtered.length === 0 ? (
        <p className="empty">No sample listings match those filters.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
