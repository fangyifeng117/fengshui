import Link from "next/link";
import { AbstractMark } from "@/components/AbstractMark";
import { ServiceDisclaimer } from "@/components/ServiceDisclaimer";
import { ZH_SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";
import { copy } from "@/lib/i18n/messages";
import { hrefFor, type Locale } from "@/lib/locale";
import { serviceDrafts } from "@/lib/places";

export function BlessingIndex({ locale }: { locale: Locale }) {
  const text = copy(locale);
  return (
    <div className="page narrow">
      <header className="section-head">
        <p>{text.demo}</p>
        <h1>{text.blessing.title}</h1>
        <p>{text.blessing.lede}</p>
        <p>{text.blessing.noForm}</p>
      </header>
      <div className="place-grid">
        {serviceDrafts.map((service) => {
          const image = service.images?.[0];
          return (
            <Link key={service.slug} className="card" href={hrefFor(locale, `/blessing/${service.slug}`)}>
              {image ? (
                <div className="card-media lamp-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.src} width={image.width} height={image.height} alt={image.alt[locale]} />
                </div>
              ) : (
                <AbstractMark label={text.demo} />
              )}
              <h2>{service.title[locale]}</h2>
              <p>{service.status ? service.status[locale] : text.comingSoon}</p>
              {service.offers?.map((offer) => (
                <p key={offer.id}>{offer.label[locale]}</p>
              ))}
            </Link>
          );
        })}
      </div>
      <p>{text.blessing.draftNote}</p>
      <ServiceDisclaimer translation={locale === "zh" ? ZH_SERVICE_DRAFT_DISCLAIMER : undefined} />
    </div>
  );
}
