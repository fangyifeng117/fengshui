import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/catalog";
import { getContentPages } from "@/lib/content";
import { hrefFor } from "@/lib/locale";
import { places, serviceDrafts } from "@/lib/places";
import { absoluteUrl } from "@/lib/public-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/products",
    "/cart",
    "/checkout",
    "/order/success",
    "/order/cancel",
    "/legal/disclaimer",
    "/legal/privacy",
    "/legal/terms",
    "/temples",
    "/blessing",
    "/videos",
    "/stories",
    "/account",
    "/about",
    "/faq",
    "/shipping",
    ...getProducts().map((product) => `/products/${product.slug}`),
    ...getCollections().map((collection) => `/collections/${collection.slug}`),
    ...getContentPages().map((page) => `/content/${page.slug}`),
    ...places.map((place) => `/temples/${place.slug}`),
    ...serviceDrafts.map((service) => `/blessing/${service.slug}`),
  ];
  return paths.map((path) => ({
    url: absoluteUrl(path),
    alternates: {
      languages: {
        en: absoluteUrl(hrefFor("en", path)),
        zh: absoluteUrl(hrefFor("zh", path)),
      },
    },
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
