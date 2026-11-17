"use client";

import { useState } from "react";
import { PayPalHandoff } from "@/components/PayPalHandoff";
import type { CheckoutDeskState } from "@/lib/commerce/present";

export function CheckoutDesk({
  state,
  clientId,
  currency,
  demoBlocked,
}: {
  state: CheckoutDeskState;
  clientId: string | null;
  currency: "USD";
  demoBlocked: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runMock() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "mock" }),
      });
      const payload = (await response.json()) as { orderId?: string; paid?: boolean };
      if (!response.ok || !payload.orderId || payload.paid) {
        setError("The mock preview could not be stored.");
        setPending(false);
        return;
      }
      window.location.href = `/order/success?order=${encodeURIComponent(payload.orderId)}`;
    } catch {
      setError("The mock preview could not be stored.");
      setPending(false);
    }
  }

  return (
    <div className="checkout-desk">
      <section className="pay-panel" data-payment-state={state.state}>
        <h2>PayPal</h2>
        {state.state === "ready" && clientId ? (
          <PayPalHandoff clientId={clientId} currency={currency} />
        ) : (
          <button type="button" className="button button-disabled" disabled>
            {state.buttonLabel}
          </button>
        )}
        <p>{state.detail}</p>
        {demoBlocked ? (
          <p className="fine">Sample SKUs in this cart are blocked from genuine capture.</p>
        ) : null}
      </section>
      <section className="mock-panel">
        <p className="mock-flag">MOCK</p>
        <h2>Isolated mock demonstration</h2>
        <p>
          This writes a record marked MOCK. It does not contact PayPal, does not capture funds, and cannot mark an
          order paid.
        </p>
        <button type="button" className="button button-ghost" onClick={runMock} disabled={pending}>
          {pending ? "Saving mock…" : "Preview a MOCK return"}
        </button>
        {error ? <p className="form-error">{error}</p> : null}
      </section>
    </div>
  );
}
