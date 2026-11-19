"use client";

import { useState } from "react";

export function PurchaseActions({ productId }: { productId: string }) {
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
        setError("The sample could not be added.");
        setPending(null);
        return;
      }
      window.location.href = action === "buy" ? "/checkout" : "/cart";
    } catch {
      setError("The sample could not be added.");
      setPending(null);
    }
  }

  return (
    <div className="purchase-actions">
      <button type="button" className="button" onClick={() => submit("add")} disabled={pending != null}>
        {pending === "add" ? "Adding…" : "Add to cart"}
      </button>
      <button type="button" className="button button-ghost" onClick={() => submit("buy")} disabled={pending != null}>
        {pending === "buy" ? "Opening…" : "View demo checkout"}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
