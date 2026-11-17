import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/catalog";
import { getContentPages } from "@/lib/content";
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
    ...getProducts().map((product) => `/products/${product.slug}`),
    ...getCollections().map((collection) => `/collections/${collection.slug}`),
    ...getContentPages().map((page) => `/content/${page.slug}`),
  ];
  return paths.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
