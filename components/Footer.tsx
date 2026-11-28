import Link from "next/link";
import { SupportEmail } from "@/components/SupportEmail";
import { getCollections } from "@/lib/catalog";
import { merchantIdentity } from "@/lib/merchant";
import { BRAND_LATIN, BRAND_NAME, COPYRIGHT_LINE, publicConfig } from "@/lib/public-config";
import { SHORT_FOOTER_DISCLAIMER, ZH_SHORT_FOOTER_DISCLAIMER } from "@/lib/disclaimer";
import { displayCollectionTitle } from "@/lib/i18n/display";
import { copy } from "@/lib/i18n/messages";
import { asLocale, hrefFor, type Locale } from "@/lib/locale";

export function Footer({ locale = "en" }: { locale?: Locale }) {
  const text = copy(asLocale(locale));
  const collections = getCollections();
  const sentence = SHORT_FOOTER_DISCLAIMER.replace(" Full disclaimer.", "");
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section>
          <h2>{text.footer.shop}</h2>
          <Link href={hrefFor(locale, "/products")}>{text.footer.allSamples}</Link>
          {collections.map((collection) => (
            <Link key={collection.slug} href={hrefFor(locale, `/collections/${collection.slug}`)}>
              {displayCollectionTitle(collection, locale)}
            </Link>
          ))}
          <Link href={hrefFor(locale, "/temples")}>{text.footer.places}</Link>
          <Link href={hrefFor(locale, "/blessing")}>{text.footer.blessing}</Link>
          <Link href={hrefFor(locale, "/cart")}>{text.nav.cart}</Link>
          <Link href={hrefFor(locale, "/shipping")}>{text.footer.shipping}</Link>
        </section>
        <section>
          <h2>{text.footer.legal}</h2>
          <Link href={hrefFor(locale, "/legal/disclaimer")}>{text.footer.disclaimer}</Link>
          <Link href={hrefFor(locale, "/legal/privacy")}>{text.footer.privacy}</Link>
          <Link href={hrefFor(locale, "/legal/terms")}>{text.footer.terms}</Link>
          <Link href={hrefFor(locale, "/content/cultural-notes")}>{text.footer.notes}</Link>
          <Link href={hrefFor(locale, "/about")}>{text.footer.about}</Link>
          <Link href={hrefFor(locale, "/faq")}>{text.footer.faq}</Link>
          <p>{merchantIdentity.legalName}</p>
          <p>{merchantIdentity.address}</p>
          <p>{publicConfig.baseUrl}</p>
        </section>
        <section>
          <h2>{text.footer.contact}</h2>
          <p>
            {text.footer.supportLead} <SupportEmail />
          </p>
          <p>{text.footer.supportNote}</p>
          <Link href={hrefFor(locale, "/videos")}>{text.footer.videos}</Link>
          <Link href={hrefFor(locale, "/stories")}>{text.footer.stories}</Link>
          <Link href={hrefFor(locale, "/account")}>{text.footer.account}</Link>
        </section>
      </div>
      <p className="footer-disclaimer">
        {sentence} <Link href={hrefFor(locale, "/legal/disclaimer")}>Full disclaimer.</Link>
      </p>
      {locale === "zh" ? (
        <p className="footer-disclaimer" lang="zh">
          {ZH_SHORT_FOOTER_DISCLAIMER.replace("完整免责声明。", "")}
          <Link href={hrefFor(locale, "/legal/disclaimer")}>完整免责声明。</Link>
        </p>
      ) : null}
      <p className="footer-brand">
        {BRAND_NAME} · {BRAND_LATIN}
      </p>
      <p className="footer-copy">{COPYRIGHT_LINE}</p>
    </footer>
  );
}
