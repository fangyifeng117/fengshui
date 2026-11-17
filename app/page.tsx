import Link from "next/link";
import { HeroArt } from "@/components/HeroArt";
import { SupportEmail } from "@/components/SupportEmail";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/catalog";
import { homeCopy } from "@/lib/home-copy";

export default function HomePage() {
  const featured = getFeaturedProducts();
  return (
    <div className="page">
      <section className="hero" data-section="hero">
        <div>
          <p className="kicker">{homeCopy.kicker}</p>
          <h1>{homeCopy.title}</h1>
          <p className="lede">{homeCopy.lede}</p>
          <div className="cta-row">
            <Link className="button" href="/products">
              {homeCopy.primaryCta}
            </Link>
            <Link className="button button-ghost" href="/content/guide">
              {homeCopy.secondaryCta}
            </Link>
          </div>
        </div>
        <HeroArt />
      </section>
      <section data-section="featured">
        <div className="section-head">
          <h2>{homeCopy.featuredTitle}</h2>
          <p>{homeCopy.featuredDek}</p>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="trust-strip" data-section="trust">
        <h2>{homeCopy.trustTitle}</h2>
        <div className="trust-grid">
          {homeCopy.trust.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section data-section="faq" className="faq-teaser">
        <div className="section-head">
          <h2>{homeCopy.faqTitle}</h2>
          <Link href="/content/faq">All questions</Link>
        </div>
        <div className="faq-list">
          {homeCopy.faq.map((item) => (
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
