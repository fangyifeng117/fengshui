"use client";

import Link from "next/link";
import { useState } from "react";
import { copy } from "@/lib/i18n/messages";
import { hrefFor, type Locale } from "@/lib/locale";

type CartItem = {
  productId: string;
  slug: string;
  title: string;
  quantity: number;
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
          <div className="cart-thumb media-hold">
            <p>{text.product.pending}</p>
          </div>
          <div>
            <h2>
              <Link href={hrefFor(locale, `/products/${item.slug}`)}>{item.title}</Link>
            </h2>
            <p>{text.product.pending}</p>
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
        </article>
      ))}
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
