import Link from "next/link";
import { SupportEmail } from "@/components/SupportEmail";
import { ThemeCard } from "@/components/ThemeCard";
import { getProductBySlug } from "@/lib/catalog";
import { displayAlt, displayTitle } from "@/lib/i18n/display";
import { copy } from "@/lib/i18n/messages";
import { hrefFor, type Locale } from "@/lib/locale";
import { presentImages } from "@/lib/media";
import { getServiceDraft, places } from "@/lib/places";
import { themeImages } from "@/lib/theme-images";

const slots = ["bracelet-a", "bracelet-b", "cord"] as const;

export function HomeScreen({ locale = "en" }: { locale?: Locale }) {
  const text = copy(locale);
  const bracelet = getProductBySlug("babao-liuli-bracelet");
  const cord = getProductBySlug("goat-year-red-string-coiled");
  if (!bracelet || !cord) throw new Error("missing product");
  const photo = bracelet.images[0];
  const questions = [
    { question: text.faq.pay, answer: text.faq.payAnswer, supportEmail: false },
    { question: text.faq.pictures, answer: text.faq.picturesAnswer, supportEmail: false },
    { question: text.faq.ask, answer: text.faq.askAnswer, supportEmail: true },
  ];
  const productHref = hrefFor(locale, `/products/${bracelet.slug}`);
  const cordHref = hrefFor(locale, `/products/${cord.slug}`);
  const cordPhoto = presentImages(cord.images)[0];
  const lampHref = hrefFor(locale, "/blessing/offering-lamps");
  const offers = getServiceDraft("offering-lamps")?.offers;
  if (!offers?.length) throw new Error("missing lamp offers");
  const notForSale = locale === "zh" ? "现在不能购买" : "not for sale";
  return (
    <div className="page">
      <section className="home-hero" data-section="hero">
        <div className="home-hero-copy">
          <p className="kicker">{text.home.kicker}</p>
          <h1>{text.home.heroTitle}</h1>
          <p className="lede">{text.home.heroSub}</p>
        </div>
        <aside className="hero-fees" aria-labelledby="hero-fees-title">
          <h2 id="hero-fees-title">{text.home.feeOptions}</h2>
          <dl>
            {offers.map((offer) => {
              const detail = offer.detail[locale];
              const closed = detail.toLowerCase().includes(notForSale) ? "" : locale === "zh" ? "现在不能购买。" : "Not for sale.";
              return (
                <div key={offer.id}>
                  <dt>
                    <Link href={lampHref}>{offer.label[locale]}</Link>
                  </dt>
                  <dd>
                    {detail}
                    {closed ? `${/。$/.test(detail) ? "" : " "}${closed}` : ""}
                  </dd>
                </div>
              );
            })}
          </dl>
        </aside>
      </section>
      <section data-section="featured" aria-label={text.home.gridTitle}>
        <h2>{text.home.gridTitle}</h2>
        <div className="home-grid">
          <Link className="home-feature-card" href={productHref}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.src} width={photo.width} height={photo.height} alt={displayAlt(bracelet, 0, locale)} />
            ) : null}
            <strong>{displayTitle(bracelet, locale)}</strong>
            <p className="home-price">USD 188</p>
            <p>{text.home.featureMeta}</p>
          </Link>
          {slots.map((id) =>
            id === "cord" ? (
              <Link key={id} className="home-feature-card" href={cordHref}>
                {cordPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cordPhoto.src}
                    width={cordPhoto.width}
                    height={cordPhoto.height}
                    alt={displayAlt(cord, 0, locale)}
                  />
                ) : null}
                <strong>{displayTitle(cord, locale)}</strong>
                <p className="home-price">USD 30</p>
                <p>{text.home.cordMeta}</p>
              </Link>
            ) : (
              <article key={id} className="home-slot">
                <span>{locale === "zh" ? "待上架" : "Coming soon"}</span>
                <strong>{text.home.slotBracelet}</strong>
                <p>{text.home.slotNote}</p>
              </article>
            ),
          )}
        </div>
      </section>
      <section className="lamp-banner" data-section="lamps">
        <div>
          <h2>{text.home.heroTitle}</h2>
          <p>{text.home.lampNote}</p>
        </div>
        <Link className="button" href={lampHref}>
          {text.home.lampCta}
        </Link>
      </section>
      <ul className="home-trust" data-section="trust">
        <li>
          <strong>{text.home.trustPay}</strong>
          <p>{text.home.trustPayNote}</p>
        </li>
        <li>
          <strong>{text.home.trustShip}</strong>
          <p>{text.home.trustShipNote}</p>
        </li>
        <li>
          <strong>{text.home.trustOpen}</strong>
          <p>{text.home.trustOpenNote}</p>
        </li>
      </ul>
      <section aria-label={text.home.references}>
        <h2>{text.home.references}</h2>
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
