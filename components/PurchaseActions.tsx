"use client";

import { useState } from "react";
import { hrefFor, type Locale } from "@/lib/locale";

export function PurchaseActions({
  productId,
  locale = "en",
  addLabel = "Add to cart",
  buyLabel = "View demo checkout",
  pendingAdd = "Adding…",
  pendingBuy = "Opening…",
  errorLabel = "The sample could not be added.",
}: {
  productId: string;
  locale?: Locale;
  addLabel?: string;
  buyLabel?: string;
  pendingAdd?: string;
  pendingBuy?: string;
  errorLabel?: string;
}) {
  const [pending, setPending] = useState<"add" | "buy" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(action: "add" | "buy") {
    setPending(action);
    setError(null);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!response.ok) {
        setError(errorLabel);
        setPending(null);
        return;
      }
      window.location.href = hrefFor(locale, action === "buy" ? "/checkout" : "/cart");
    } catch {
      setError(errorLabel);
      setPending(null);
    }
  }

  return (
    <div className="purchase-actions">
      <button type="button" className="button" onClick={() => submit("add")} disabled={pending != null}>
        {pending === "add" ? pendingAdd : addLabel}
      </button>
      <button type="button" className="button button-ghost" onClick={() => submit("buy")} disabled={pending != null}>
        {pending === "buy" ? pendingBuy : buyLabel}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
