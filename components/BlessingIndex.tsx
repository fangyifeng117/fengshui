import Link from "next/link";
import { AbstractMark } from "@/components/AbstractMark";
import { ServiceDisclaimer } from "@/components/ServiceDisclaimer";
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
        {serviceDrafts.map((service) => (
          <Link key={service.slug} className="card" href={hrefFor(locale, `/blessing/${service.slug}`)}>
            <AbstractMark label={text.demo} />
            <h2>{service.title[locale]}</h2>
            <p>{text.comingSoon}</p>
          </Link>
        ))}
      </div>
      <p>{text.blessing.draftNote}</p>
      <ServiceDisclaimer />
    </div>
  );
}
