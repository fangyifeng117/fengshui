import Link from "next/link";
import { SupportEmail } from "@/components/SupportEmail";
import { copy } from "@/lib/i18n/messages";
import { asLocale, hrefFor } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const text = copy(asLocale(locale));
  return pageMetadata({ title: text.faq.title, description: text.faq.lede, path: "/faq", locale });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  const text = copy(locale);
  return (
    <div className="page narrow">
      <header className="section-head">
        <h1>{text.faq.title}</h1>
        <p>{text.faq.lede}</p>
      </header>
      <div className="faq-list">
        <details>
          <summary>{text.faq.pay}</summary>
          <p>{text.faq.payAnswer}</p>
        </details>
        <details>
          <summary>{text.faq.pictures}</summary>
          <p>{text.faq.picturesAnswer}</p>
        </details>
        <details>
          <summary>{text.faq.ask}</summary>
          <p>
            {text.faq.askAnswer} <SupportEmail />
          </p>
        </details>
      </div>
      <p>
        <Link href={hrefFor(locale, "/content/faq")}>{text.faq.more}</Link>
      </p>
    </div>
  );
}
