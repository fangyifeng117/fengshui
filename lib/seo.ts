import type { Metadata } from "next";
import { hrefFor } from "@/lib/locale";
import { absoluteUrl, publicConfig } from "@/lib/public-config";

export function robotsMetadata(): Metadata["robots"] {
  if (publicConfig.indexingApproved) {
    return { index: true, follow: true };
  }
  return { index: false, follow: false, nocache: true };
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  locale?: string;
  absoluteTitle?: boolean;
}): Metadata {
  const locale = input.locale === "zh" ? "zh" : "en";
  const canonical = absoluteUrl(hrefFor(locale, input.path));
  const en = absoluteUrl(hrefFor("en", input.path));
  const zh = absoluteUrl(hrefFor("zh", input.path));
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: {
      canonical,
      languages: { en, zh, "x-default": en },
    },
    robots: robotsMetadata(),
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: publicConfig.brandName,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
  };
}

export function productJsonLd(input: {
  name: string;
  description: string;
  sku: string;
  images: string[];
  price: string;
  currency: "USD";
  url: string;
  brandName: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    sku: input.sku,
    image: input.images,
    brand: {
      "@type": "Brand",
      name: input.brandName,
    },
    offers: {
      "@type": "Offer",
      url: input.url,
      priceCurrency: input.currency,
      price: input.price,
      availability: "https://schema.org/OutOfStock",
      description: "Illustrative sample price. Demo capture is disabled, so this is not a live offer.",
    },
  };
}
