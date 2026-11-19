import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { hrefFor, type Locale } from "@/lib/locale";
import type { Product } from "@/lib/types";

export function ProductCard({ product, locale = "en" }: { product: Product; locale?: Locale }) {
  const image = product.images[0];
  return (
    <Link className="card" href={hrefFor(locale, `/products/${product.slug}`)}>
      <div className="card-media">
        {image ? (
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 33vw" loading="eager" />
        ) : null}
        <span className="pill">Sample</span>
      </div>
      <h3>{product.title}</h3>
      <p className="price">{formatMoney(product.price, product.currency)}</p>
    </Link>
  );
}
