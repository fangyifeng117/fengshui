import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Outfit } from "next/font/google";
import { headers } from "next/headers";
import { publicConfig } from "@/lib/public-config";
import { pageMetadata } from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(publicConfig.baseUrl),
  ...pageMetadata({
    title: publicConfig.brandName,
    description:
      "神秘东方. Payment is off.",
    path: "/",
    absoluteTitle: true,
  }),
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = (await headers()).get("X-NEXT-INTL-LOCALE") === "zh" ? "zh" : "en";
  return (
    <html lang={locale} className={`${outfit.variable} ${fraunces.variable}`}>
      {publicConfig.indexingApproved ? null : (
        <head>
          <meta name="robots" content="noindex, nofollow, nocache" />
        </head>
      )}
      <body>{children}</body>
    </html>
  );
}
