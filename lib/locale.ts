export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export function asLocale(value: string | undefined): Locale {
  return value === "zh" ? "zh" : "en";
}

export function hrefFor(locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale !== "zh") return normalized;
  return normalized === "/" ? "/zh" : `/zh${normalized}`;
}
