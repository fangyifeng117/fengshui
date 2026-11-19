import Link from "next/link";
import { copy } from "@/lib/i18n/messages";
import { asLocale, hrefFor } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({ title: text.shipping.title, description: text.shipping.lede, path: "/shipping", locale });
}

export default async function ShippingPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const text = copy(locale);
  return (
    <div className="page narrow">
      <header className="section-head">
        <p>{text.demo}</p>
        <h1>{text.shipping.title}</h1>
        <p>{text.shipping.lede}</p>
      </header>
      <p>
        <Link href={hrefFor(locale, "/content/shipping-returns")}>{text.shipping.more}</Link>
      </p>
    </div>
  );
}
