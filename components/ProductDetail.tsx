import type { ReactNode } from "react";
import Link from "next/link";
import { ExactDisclaimer } from "@/components/ExactDisclaimer";
import { Gallery } from "@/components/Gallery";
import { PurchaseActions } from "@/components/PurchaseActions";
import { ProductCard } from "@/components/ProductCard";
import { collectionTitle } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import { trustBadges } from "@/lib/home-copy";
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
  const modules: Record<(typeof PRODUCT_MODULE_ORDER)[number], ReactNode> = {
    breadcrumb: (
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href={hrefFor(locale, "/")}>{text.product.home}</Link>
        <span aria-hidden="true">/</span>
        <Link href={hrefFor(locale, "/products")}>{text.nav.shop}</Link>
        <span aria-hidden="true">/</span>
        <Link href={hrefFor(locale, `/collections/${product.collection}`)}>{collectionTitle(product.collection)}</Link>
        <span aria-hidden="true">/</span>
        <span>{product.title}</span>
      </nav>
    ),
    gallery: <Gallery images={product.images} />,
    purchase: (
      <div className="purchase-block">
        <h1>{product.title}</h1>
        <p className="price price-large">{formatMoney(product.price, product.currency)}</p>
        <PurchaseActions
          productId={product.id}
          locale={locale}
          addLabel={text.product.add}
          buyLabel={text.product.view}
          pendingAdd={text.product.adding}
          pendingBuy={text.product.opening}
          errorLabel={text.product.error}
        />
        <p>{product.description}</p>
      </div>
    ),
    benefits: (
      <div>
        <h2>About this sample</h2>
        <ul className="plain-list">
          {product.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>
    ),
    trust: (
      <div>
        <h2>Trust notes</h2>
        <ul className="badge-list">
          {trustBadges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
      </div>
    ),
    specs: (
      <div>
        <h2>Specs and details</h2>
        <dl className="spec-list">
          {product.specs.map((spec) => (
            <div key={spec.label}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    ),
    use: (
      <div>
        <h2>Practical use and placement</h2>
        <ul className="plain-list">
          {product.useNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    ),
    disclaimer: (
      <div>
        <h2>Disclaimer</h2>
        <ExactDisclaimer />
      </div>
    ),
    faq: (
      <div>
        <h2>Questions</h2>
        <div className="faq-list">
          {product.faq.map((item) => (
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
        <h2>Related samples</h2>
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
