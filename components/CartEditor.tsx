"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatMoney } from "@/lib/format";

type CartItem = {
  productId: string;
  slug: string;
  title: string;
  quantity: number;
  unitAmountCents: number;
  currency: "USD";
  image: string;
  imageAlt: string;
};

export function CartEditor({ items }: { items: CartItem[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function update(productId: string, quantity: number) {
    setPendingId(productId);
    setError(null);
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        setError("The cart could not be updated.");
        setPendingId(null);
        return;
      }
      window.location.reload();
    } catch {
      setError("The cart could not be updated.");
      setPendingId(null);
    }
  }

  return (
    <div className="cart-lines">
      {items.map((item) => (
        <article key={item.productId} className="cart-line">
          <div className="cart-thumb">
            <Image src={item.image} alt={item.imageAlt} fill sizes="160px" />
          </div>
          <div>
            <h2>
              <Link href={`/products/${item.slug}`}>{item.title}</Link>
            </h2>
            <p className="fine">Sample · {formatMoney(item.unitAmountCents, item.currency)} each</p>
            <div className="qty-row">
              <label htmlFor={`qty-${item.productId}`}>Quantity</label>
              <select
                id={`qty-${item.productId}`}
                value={item.quantity}
                disabled={pendingId != null}
                onChange={(event) => update(item.productId, Number(event.target.value))}
              >
                {Array.from({ length: 9 }, (_, index) => index + 1).map((qty) => (
                  <option key={qty} value={qty}>
                    {qty}
                  </option>
                ))}
              </select>
              <button type="button" className="text-button" onClick={() => update(item.productId, 0)} disabled={pendingId != null}>
                Remove
              </button>
            </div>
          </div>
          <p className="price">{formatMoney(item.unitAmountCents * item.quantity, item.currency)}</p>
        </article>
      ))}
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
