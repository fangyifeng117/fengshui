import Link from "next/link";
import { HeroArt } from "@/components/HeroArt";
import { SupportEmail } from "@/components/SupportEmail";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/catalog";
import { homeCopy } from "@/lib/home-copy";
import { copy } from "@/lib/i18n/messages";
import { hrefFor, type Locale } from "@/lib/locale";

export function HomeScreen({ locale = "en" }: { locale?: Locale }) {
  const text = copy(locale);
  const featured = getFeaturedProducts();
  const questions =
    locale === "zh"
      ? [
          { question: text.faq.pay, answer: text.faq.payAnswer, supportEmail: false },
          { question: text.faq.pictures, answer: text.faq.picturesAnswer, supportEmail: false },
          { question: "去哪里问问题？", answer: "使用客户支持地址。", supportEmail: true },
        ]
      : homeCopy.faq;
  return (
    <div className="page">
      <section className="hero" data-section="hero">
        <div>
          <h1>{text.home.title}</h1>
          <div className="cta-row">
            <Link className="button" href={hrefFor(locale, "/products")}>
              {text.home.shop}
            </Link>
          </div>
        </div>
        <HeroArt />
      </section>
      <section data-section="featured" aria-label={text.home.title}>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>
      <section data-section="faq" className="faq-teaser">
        <div className="section-head">
          <h2>{text.home.questions}</h2>
          <Link href={hrefFor(locale, "/faq")}>{text.home.allQuestions}</Link>
        </div>
        <div className="faq-list">
          {questions.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>
                {item.answer} {item.supportEmail ? <SupportEmail /> : null}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
