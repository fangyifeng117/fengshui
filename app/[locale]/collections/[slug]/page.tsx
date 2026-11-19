import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCollection, getProductsByCollection } from "@/lib/catalog";
import { displayCollectionDescription, displayCollectionTitle } from "@/lib/i18n/display";
import { asLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const collection = getCollection(slug);
  if (!collection) {
    return pageMetadata({
      title: "Collection not found",
      description: "That collection is not in this demonstration catalog.",
      path: `/collections/${slug}`,
      locale,
    });
  }
  const active = asLocale(locale);
  return pageMetadata({
    title: displayCollectionTitle(collection, active),
    description: active === "zh" ? displayCollectionDescription(collection, active) : collection.seo.description,
    path: `/collections/${collection.slug}`,
    locale,
  });
}

export default async function CollectionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = asLocale(localeParam);
  const collection = getCollection(slug);
  if (!collection) notFound();
  const items = getProductsByCollection(collection.slug);
  return (
    <div className="page">
      <header className="section-head">
        <h1>{displayCollectionTitle(collection, locale)}</h1>
        <p>{displayCollectionDescription(collection, locale)}</p>
      </header>
      <div className="product-grid">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </div>
  );
}
