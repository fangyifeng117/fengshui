import type { ReactNode } from "react";
import Link from "next/link";
import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { ServiceDisclaimer } from "@/components/ServiceDisclaimer";
import { Gallery } from "@/components/Gallery";
import { ProductCard } from "@/components/ProductCard";
import { getCollection } from "@/lib/catalog";
import { ZH_EXACT_DISCLAIMER, ZH_SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";
import { trustBadges } from "@/lib/home-copy";
import {
  displayAlt,
  displayBenefits,
  displayCollectionTitle,
  displayDescription,
  displayFaq,
  displayPhrase,
  displayTitle,
  displayUseNotes,
  zhTrustBadges,
} from "@/lib/i18n/display";
import { copy } from "@/lib/i18n/messages";
import { hrefFor } from "@/lib/locale";
import type { Product } from "@/lib/types";

export const PRODUCT_MODULE_ORDER = [
  "breadcrumb",
  "gallery",
  "purchase",
  "benefits",
  "trust",
  "specs",
  "use",
  "disclaimer",
  "faq",
  "related",
] as const;

export function ProductDetail({
  product,
  related,
  locale = "en",
}: {
  product: Product;
  related: Product[];
  locale?: "en" | "zh";
}) {
  const text = copy(locale);
  const collection = getCollection(product.collection);
  const title = displayTitle(product, locale);
  const shown = product.publicListing === true;
  const photo = shown ? product.images[0] : undefined;
  const modules: Record<(typeof PRODUCT_MODULE_ORDER)[number], ReactNode> = {
    breadcrumb: (
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href={hrefFor(locale, "/")}>{text.product.home}</Link>
        <span aria-hidden="true">/</span>
        <Link href={hrefFor(locale, "/products")}>{text.nav.shop}</Link>
        <span aria-hidden="true">/</span>
        <Link href={hrefFor(locale, `/collections/${product.collection}`)}>
          {collection ? displayCollectionTitle(collection, locale) : product.collection}
        </Link>
        <span aria-hidden="true">/</span>
        <span>{title}</span>
      </nav>
    ),
    gallery: photo ? (
      <Gallery
        label={text.product.pending}
        image={{ ...photo, alt: displayAlt(product, 0, locale) }}
      />
    ) : (
      <Gallery label={text.product.pending} />
    ),
    purchase: (
      <div className="purchase-block">
        <h1>{title}</h1>
        {shown ? (
          <>
            <p className="price-large">USD {product.price / 100}</p>
            <p>{locale === "zh" ? `库存 ${product.illustrativeQuantity} 件` : `${product.illustrativeQuantity} on hand`}</p>
            <p>{locale === "zh" ? "支付已关闭。这里不能加入购物车。" : "Payment is off. There is no cart button."}</p>
          </>
        ) : (
          <p>{text.product.pending}</p>
        )}
        <p>{displayDescription(product, locale)}</p>
      </div>
    ),
    benefits: (
      <div>
        <h2>{shown ? (locale === "zh" ? "关于这串手串" : "About this bracelet") : text.product.about}</h2>
        <ul className="plain-list">
          {displayBenefits(product, locale).map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>
    ),
    trust: (
      <div>
        <h2>{text.product.trust}</h2>
        <ul className="badge-list">
          {(locale === "zh" ? zhTrustBadges : trustBadges)
            .filter((badge) => {
              if (badge === "Illustrative USD price" || badge === "示意美元价格") return false;
              if (shown && (badge === "Sample illustration" || badge === "样品图稿")) return false;
              if (shown && (badge === "Shipping and returns are drafts" || badge === "配送和退货仍是草稿")) return false;
              return true;
            })
            .map((badge) => (
              <li key={badge}>{badge}</li>
            ))}
        </ul>
      </div>
    ),
    specs: (
      <div>
        <h2>{text.product.specs}</h2>
        <dl className="spec-list">
          {product.specs.filter((spec) => spec.label !== "Price type").map((spec) => (
            <div key={spec.label}>
              <dt>{displayPhrase(spec.label, product, locale)}</dt>
              <dd>{displayPhrase(spec.value, product, locale)}</dd>
            </div>
          ))}
        </dl>
      </div>
    ),
    use: (
      <div>
        <h2>{text.product.use}</h2>
        <ul className="plain-list">
          {displayUseNotes(product, locale).map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    ),
    disclaimer: (
      <div>
        <h2>{text.product.disclaimer}</h2>
        <ExactDisclaimer translation={locale === "zh" ? ZH_EXACT_DISCLAIMER : undefined} />
        <ServiceDisclaimer translation={locale === "zh" ? ZH_SERVICE_DRAFT_DISCLAIMER : undefined} />
      </div>
    ),
    faq: (
      <div>
        <h2>{text.product.questions}</h2>
        <div className="faq-list">
          {displayFaq(product, locale).map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    ),
    related: (
      <div>
        <h2>{text.product.related}</h2>
        <div className="product-grid">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} locale={locale} />
          ))}
        </div>
      </div>
    ),
  };

  return (
    <article className="product-detail">
      {PRODUCT_MODULE_ORDER.map((id) => (
        <section key={id} data-module={id} className="product-module">
          {modules[id]}
        </section>
      ))}
    </article>
  );
}
