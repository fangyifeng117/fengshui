import Image from "next/image";
import Link from "next/link";
import { collectionTitle } from "@/lib/catalog";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  return (
    <Link className="card" href={`/products/${product.slug}`}>
      <div className="card-media">
        {image ? <Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 33vw" /> : null}
        <span className="pill">Sample</span>
      </div>
      <p className="kicker">{collectionTitle(product.collection)}</p>
      <h3>{product.title}</h3>
      <p className="price">{formatMoney(product.price, product.currency)}</p>
      <p className="card-note">Illustrative price · not a live offer</p>
    </Link>
  );
}
