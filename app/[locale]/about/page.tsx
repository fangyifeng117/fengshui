import Link from "next/link";
import { copy } from "@/lib/i18n/messages";
import { asLocale, hrefFor } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({ title: text.about.title, description: text.about.lede, path: "/about", locale });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const text = copy(locale);
  return (
    <div className="page narrow">
      <header className="section-head">
        <h1>{text.about.title}</h1>
        <p>{text.about.lede}</p>
        <p>{text.about.places}</p>
      </header>
      <p>
        <Link href={hrefFor(locale, "/temples")}>{text.places.title}</Link>
      </p>
    </div>
  );
}
