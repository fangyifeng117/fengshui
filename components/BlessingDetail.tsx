import { AbstractMark } from "@/components/AbstractMark";
import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { ServiceDisclaimer } from "@/components/ServiceDisclaimer";
import { ZH_EXACT_DISCLAIMER, ZH_SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";
import { copy } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/locale";
import type { ServiceDraft, ServiceImage } from "@/lib/places";

function LampFigure({ image, locale }: { image: ServiceImage; locale: Locale }) {
  return (
    <figure>
      <picture>
        <source srcSet={image.webp} type="image/webp" />
        <img src={image.src} width={image.width} height={image.height} alt={image.alt[locale]} />
      </picture>
    </figure>
  );
}

export function BlessingDetail({ locale, service }: { locale: Locale; service: ServiceDraft }) {
  const text = copy(locale);
  const shown = Boolean(service.offers?.length);
  return (
    <div className="page narrow">
      <header className="section-head">
        <h1>{service.title[locale]}</h1>
        <p>{shown ? service.status?.[locale] : text.comingSoon}</p>
        <p>{text.blessing.lede}</p>
        <p>{service.summary[locale]}</p>
        {service.scope ? <p>{service.scope[locale]}</p> : null}
        {service.registry ? <p>{service.registry[locale]}</p> : null}
        <p>{text.blessing.noForm}</p>
      </header>
      {shown ? (
        <>
          <dl className="offer-list">
            {service.offers?.map((offer) => (
              <div key={offer.id}>
                <dt>{offer.label[locale]}</dt>
                <dd>{offer.detail[locale]}</dd>
              </div>
            ))}
          </dl>
          {service.images?.length ? (
            <div className="lamp-gallery">
              {service.images.map((image) => (
                <LampFigure key={image.src} image={image} locale={locale} />
              ))}
            </div>
          ) : null}
          {service.faq?.length ? (
            <section>
              <h2>{locale === "zh" ? "问题" : "Questions"}</h2>
              <div className="faq-list">
                {service.faq.map((item) => (
                  <details key={item.question.en}>
                    <summary>{item.question[locale]}</summary>
                    <p>{item.answer[locale]}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
          {service.rules?.length ? (
            <section>
              <h2>{locale === "zh" ? "退款草稿" : "Refund draft"}</h2>
              <ul className="gap-list">
                {service.rules.map((rule) => (
                  <li key={rule.en}>{rule[locale]}</li>
                ))}
              </ul>
            </section>
          ) : null}
          {service.gaps?.length ? (
            <section>
              <h2>{locale === "zh" ? "尚未确认" : "Not confirmed yet"}</h2>
              <ul className="gap-list">
                {service.gaps.map((gap) => (
                  <li key={gap.en}>{gap[locale]}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : (
        <AbstractMark label={text.demo} />
      )}
      {shown ? null : <p>{text.blessing.draftNote}</p>}
      <ExactDisclaimer translation={locale === "zh" ? ZH_EXACT_DISCLAIMER : undefined} />
      <ServiceDisclaimer translation={locale === "zh" ? ZH_SERVICE_DRAFT_DISCLAIMER : undefined} />
      {service.supplementZh ? <p lang="zh">{service.supplementZh}</p> : null}
    </div>
  );
}
