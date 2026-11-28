import Link from "next/link";
import { displayAlt, displayTitle } from "@/lib/i18n/display";
import { copy } from "@/lib/i18n/messages";
import { hrefFor, type Locale } from "@/lib/locale";
import { presentImages } from "@/lib/media";
import type { Product } from "@/lib/types";

export function ProductCard({ product, locale = "en" }: { product: Product; locale?: Locale }) {
  const text = copy(locale);
  const listed = product.publicListing === true;
  const image = listed ? presentImages(product.images)[0] : undefined;
  const dollars = product.price / 100;
  const quantity =
    product.quantityKnown === false
      ? locale === "zh"
        ? "数量未确认"
        : "Quantity not confirmed"
      : locale === "zh"
        ? `库存 ${product.illustrativeQuantity} 件`
        : `${product.illustrativeQuantity} on hand`;
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
      <p>{listed ? `USD ${dollars} · ${quantity}` : text.product.pending}</p>
    </Link>
  );
}
