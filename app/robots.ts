import type { MetadataRoute } from "next";
import { absoluteUrl, publicConfig } from "@/lib/public-config";

export default function robots(): MetadataRoute.Robots {
  if (!publicConfig.indexingApproved) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
