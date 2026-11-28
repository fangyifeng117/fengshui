import type { Metadata } from "next";
import { hrefFor } from "@/lib/locale";
import { absoluteUrl, BRAND_NAME, BRAND_NAME_EN, publicConfig } from "@/lib/public-config";

/** Homepage document title. Both locales use the Chinese and English names. */
export const SITE_TITLE = {
  en: `${BRAND_NAME} | ${BRAND_NAME_EN}`,
  zh: `${BRAND_NAME} | ${BRAND_NAME_EN}`,
} as const;

export function siteTitle(locale?: string): string {
  return locale === "zh" ? SITE_TITLE.zh : SITE_TITLE.en;
}

export function documentTitle(pageTitle: string, locale?: string, absolute = false): string {
  const site = siteTitle(locale);
  if (absolute || pageTitle === site) return site;
  return `${pageTitle} | ${site}`;
}

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
  const title = documentTitle(input.title, locale, input.absoluteTitle);
  return {
    title: { absolute: title },
    description: input.description,
    alternates: {
      canonical,
      languages: { en, zh, "x-default": en },
    },
    robots: robotsMetadata(),
    openGraph: {
      title,
      description: input.description,
      url: canonical,
      siteName: BRAND_NAME,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
    },
  };
}

export function productJsonLd(input: {
  name: string;
  description: string;
  sku: string;
  url: string;
  brandName: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    sku: input.sku,
    url: input.url,
    brand: {
      "@type": "Brand",
      name: input.brandName,
    },
  };
}
