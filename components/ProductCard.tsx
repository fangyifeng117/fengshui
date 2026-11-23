import Link from "next/link";
import { displayTitle } from "@/lib/i18n/display";
import { copy } from "@/lib/i18n/messages";
import { hrefFor, type Locale } from "@/lib/locale";
import type { Product } from "@/lib/types";

export function ProductCard({ product, locale = "en" }: { product: Product; locale?: Locale }) {
  const text = copy(locale);
  return (
    <Link className="card" href={hrefFor(locale, `/products/${product.slug}`)}>
      <div className="card-media media-hold">
        <span className="pill">{text.product.sample}</span>
        <p>{text.product.pending}</p>
      </div>
      <h3>{displayTitle(product, locale)}</h3>
      <p>{text.product.pending}</p>
    </Link>
  );
}
