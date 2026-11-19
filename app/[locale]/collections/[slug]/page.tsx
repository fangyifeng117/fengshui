import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCollection, getProductsByCollection } from "@/lib/catalog";
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
  return pageMetadata({
    title: collection.seo.title,
    description: collection.seo.description,
    path: `/collections/${collection.slug}`,
    locale,
  });
}

export default async function CollectionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const items = getProductsByCollection(collection.slug);
  return (
    <div className="page">
      <header className="section-head">
        <h1>{collection.title}</h1>
        <p>{collection.description}</p>
      </header>
      <div className="product-grid">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale === "zh" ? "zh" : "en"} />
        ))}
      </div>
    </div>
  );
}
