import Link from "next/link";
import { displayAlt, displayTitle } from "@/lib/i18n/display";
import { copy } from "@/lib/i18n/messages";
import { hrefFor, type Locale } from "@/lib/locale";
import type { Product } from "@/lib/types";

export function ProductCard({ product, locale = "en" }: { product: Product; locale?: Locale }) {
  const text = copy(locale);
  const image = product.publicListing ? product.images[0] : undefined;
  const dollars = product.price / 100;
  return (
    <Link className="card" href={hrefFor(locale, `/products/${product.slug}`)}>
      {image ? (
        <div className="card-media lamp-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} width={image.width} height={image.height} alt={displayAlt(product, 0, locale)} />
        </div>
      ) : (
        <div className="card-media media-hold">
          <span className="pill">{text.product.sample}</span>
          <p>{text.product.pending}</p>
        </div>
      )}
      <h3>{displayTitle(product, locale)}</h3>
      <p>
        {image
          ? `USD ${dollars} · ${locale === "zh" ? `库存 ${product.illustrativeQuantity} 件` : `${product.illustrativeQuantity} on hand`}`
          : text.product.pending}
      </p>
    </Link>
  );
}
