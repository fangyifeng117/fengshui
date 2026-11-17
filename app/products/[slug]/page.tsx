import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductDetail } from "@/components/ProductDetail";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { centsToPayPal } from "@/lib/paypal/money";
import { absoluteUrl, publicConfig } from "@/lib/public-config";
import { pageMetadata, productJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return pageMetadata({
      title: "Sample not found",
      description: "That sample is not in this demonstration catalog.",
      path: `/products/${slug}`,
    });
  }
  return pageMetadata({
    title: product.seo.title,
    description: product.seo.description,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = getRelatedProducts(product);
  const url = absoluteUrl(`/products/${product.slug}`);
  return (
    <div className="page">
      <JsonLd
        data={productJsonLd({
          name: product.title,
          description: `${product.seo.description} Sample listing. Not a live offer.`,
          sku: product.id,
          images: product.images.map((image) => absoluteUrl(image.src)),
          price: centsToPayPal(product.price),
          currency: product.currency,
          url,
          brandName: publicConfig.brandName,
        })}
      />
      <ProductDetail product={product} related={related} />
    </div>
  );
}
