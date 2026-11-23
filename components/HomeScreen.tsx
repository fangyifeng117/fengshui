import Link from "next/link";
import { SupportEmail } from "@/components/SupportEmail";
import { ThemeCard } from "@/components/ThemeCard";
import { copy } from "@/lib/i18n/messages";
import { hrefFor, type Locale } from "@/lib/locale";
import { places } from "@/lib/places";
import { themeImages } from "@/lib/theme-images";

export function HomeScreen({ locale = "en" }: { locale?: Locale }) {
  const text = copy(locale);
  const questions = [
    { question: text.faq.pay, answer: text.faq.payAnswer, supportEmail: false },
    { question: text.faq.pictures, answer: text.faq.picturesAnswer, supportEmail: false },
    { question: text.faq.ask, answer: text.faq.askAnswer, supportEmail: true },
  ];
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
        <p className="hero-note">{text.product.pending}</p>
      </section>
      <section data-section="featured" aria-label={text.home.title}>
        <div className="product-grid">
          {themeImages.map((image) => (
            <ThemeCard key={image.id} image={image} locale={locale} />
          ))}
        </div>
      </section>
      <section data-section="places" aria-label={text.places.title}>
        <div className="section-head">
          <h2>{text.places.title}</h2>
          <p>{text.places.notATemple}</p>
        </div>
        <ul className="place-links">
          {places.map((place) => (
            <li key={place.slug}>
              <Link href={hrefFor(locale, `/temples/${place.slug}`)}>{place.name[locale]}</Link>
            </li>
          ))}
        </ul>
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
