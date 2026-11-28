import { ShippingPolicy } from "@/components/ShippingPolicy";
import { asLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const active = asLocale(locale);
  return pageMetadata({
    title: active === "zh" ? "配送与退货" : "Shipping and returns",
    description:
      active === "zh"
        ? "八宝琉璃手串从杭州全球包邮。支付仍关闭。"
        : "Free tracked shipping for the Babao Liuli Bracelet from Hangzhou. Payment is off.",
    path: "/shipping",
    locale,
  });
}

export default async function ShippingPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  return <ShippingPolicy locale={locale} />;
}
