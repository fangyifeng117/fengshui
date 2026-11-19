import { AbstractMark } from "@/components/AbstractMark";
import { ServiceDisclaimer } from "@/components/ServiceDisclaimer";
import { copy } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/locale";
import type { ServiceDraft } from "@/lib/places";

export function BlessingDetail({ locale, service }: { locale: Locale; service: ServiceDraft }) {
  const text = copy(locale);
  return (
    <div className="page narrow">
      <header className="section-head">
        <p>{text.demo}</p>
        <h1>{service.title[locale]}</h1>
        <p>{text.comingSoon}</p>
        <p>{text.blessing.lede}</p>
        <p>{service.summary[locale]}</p>
        <p>{text.blessing.noForm}</p>
      </header>
      <AbstractMark label={text.demo} />
      <p>{text.blessing.draftNote}</p>
      <ServiceDisclaimer />
    </div>
  );
}
