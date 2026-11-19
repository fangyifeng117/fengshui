import { AbstractMark } from "@/components/AbstractMark";
import { ProductCard } from "@/components/ProductCard";
import { getProductById } from "@/lib/catalog";
import { copy } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/locale";
import type { Place } from "@/lib/places";

export function PlaceDetail({ locale, place }: { locale: Locale; place: Place }) {
  const text = copy(locale);
  const related = place.productIds.flatMap((id) => {
    const product = getProductById(id);
    return product ? [product] : [];
  });
  return (
    <div className="page">
      <header className="section-head">
        <p>{text.demo}</p>
        <h1>{place.name[locale]}</h1>
        <p>
          {place.region[locale]} · {place.theme[locale]}
        </p>
        <p>{text.places.pending}</p>
        <p>{text.places.notATemple}</p>
      </header>
      <AbstractMark label={text.demo} />
      <section>
        <h2>{text.places.related}</h2>
        <p>{text.places.inspired}</p>
        <div className="product-grid">
          {related.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
