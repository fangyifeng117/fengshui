import type { Metadata } from "next";
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
  absoluteTitle?: boolean;
}): Metadata {
  const canonical = absoluteUrl(input.path);
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical },
    robots: robotsMetadata(),
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: publicConfig.brandName,
      locale: "en_US",
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
