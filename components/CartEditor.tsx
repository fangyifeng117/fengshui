"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatMoney } from "@/lib/format";
import { copy } from "@/lib/i18n/messages";
import { hrefFor, type Locale } from "@/lib/locale";

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

export function CartEditor({ items, locale = "en" }: { items: CartItem[]; locale?: Locale }) {
  const text = copy(locale);
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
        setError(text.cart.error);
        setPendingId(null);
        return;
      }
      window.location.reload();
    } catch {
      setError(text.cart.error);
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
              <Link href={hrefFor(locale, `/products/${item.slug}`)}>{item.title}</Link>
            </h2>
            <p className="fine">
              {formatMoney(item.unitAmountCents, item.currency)} {text.cart.each}
            </p>
            <div className="qty-row">
              <button
                type="button"
                className="step"
                aria-label={`${text.cart.decrease} ${item.title}`}
                onClick={() => update(item.productId, item.quantity - 1)}
                disabled={pendingId != null || item.quantity <= 1}
              >
                −
              </button>
              <span aria-live="polite">{item.quantity}</span>
              <button
                type="button"
                className="step"
                aria-label={`${text.cart.increase} ${item.title}`}
                onClick={() => update(item.productId, item.quantity + 1)}
                disabled={pendingId != null || item.quantity >= 9}
              >
                +
              </button>
              <button
                type="button"
                className="text-button"
                aria-label={`${text.cart.remove} ${item.title}`}
                onClick={() => update(item.productId, 0)}
                disabled={pendingId != null}
              >
                {text.cart.remove}
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
