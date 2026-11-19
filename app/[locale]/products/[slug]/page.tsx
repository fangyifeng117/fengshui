import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductDetail } from "@/components/ProductDetail";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { displayDescription, displayTitle } from "@/lib/i18n/display";
import { asLocale } from "@/lib/locale";
import { centsToPayPal } from "@/lib/paypal/money";
import { absoluteUrl, publicConfig } from "@/lib/public-config";
import { pageMetadata, productJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return pageMetadata({
      title: "Sample not found",
      description: "That sample is not in this demonstration catalog.",
      path: `/products/${slug}`,
      locale,
    });
  }
  const active = asLocale(locale);
  return pageMetadata({
    title: active === "zh" ? displayTitle(product, active) : product.seo.title,
    description: active === "zh" ? displayDescription(product, active) : product.seo.description,
    path: `/products/${product.slug}`,
    locale,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = asLocale(localeParam);
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = getRelatedProducts(product);
  const url = absoluteUrl(`/products/${product.slug}`);
  return (
    <div className="page">
      <JsonLd
        data={productJsonLd({
          name: displayTitle(product, locale),
          description:
            locale === "zh"
              ? `${displayDescription(product, locale)} 样品列表。不是在售商品。`
              : `${product.seo.description} Sample listing. Not a live offer.`,
          sku: product.id,
          images: product.images.map((image) => absoluteUrl(image.src)),
          price: centsToPayPal(product.price),
          currency: product.currency,
          url,
          brandName: publicConfig.brandName,
        })}
      />
      <ProductDetail product={product} related={related} locale={locale} />
    </div>
  );
}
