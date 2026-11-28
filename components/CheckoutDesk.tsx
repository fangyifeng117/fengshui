import type { CheckoutDeskState } from "@/lib/commerce/present";

export function CheckoutDesk({ state }: { state: CheckoutDeskState }) {
  return (
    <section className="pay-panel" data-payment-state={state.state}>
      <h2>Payment</h2>
      <button type="button" className="button button-disabled" disabled>
        {state.buttonLabel}
      </button>
      <p>{state.detail}</p>
    </section>
  );
}
