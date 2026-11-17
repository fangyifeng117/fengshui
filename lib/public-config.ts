export type PublicConfig = {
  brandName: string;
  baseUrl: string;
  announcement: string;
  indexingApproved: boolean;
  locale: "en";
  currency: "USD";
};

const DEFAULT_BRAND = "Cultural Jewelry — Demo";
const DEFAULT_BASE = "http://localhost:3000";
const DEFAULT_ANNOUNCEMENT =
  "Demonstration storefront. Sample items only. PayPal sandbox is not connected.";

function orDefault(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function normalizeBaseUrl(value: string | undefined): string {
  const raw = orDefault(value, DEFAULT_BASE);
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return DEFAULT_BASE;
    return url.origin;
  } catch {
    return DEFAULT_BASE;
  }
}

export const publicConfig: PublicConfig = {
  brandName: orDefault(process.env.NEXT_PUBLIC_BRAND_NAME, DEFAULT_BRAND),
  baseUrl: normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL),
  announcement: orDefault(process.env.NEXT_PUBLIC_ANNOUNCEMENT, DEFAULT_ANNOUNCEMENT),
  indexingApproved: process.env.SITE_INDEXING_APPROVED === "true",
  locale: "en",
  currency: "USD",
};

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, publicConfig.baseUrl).toString();
}
