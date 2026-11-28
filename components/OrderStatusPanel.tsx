import type { OrderView } from "@/lib/commerce/present";

export function OrderStatusPanel({
  view,
  heading,
  pendingLabel = "Details to be confirmed",
}: {
  view: OrderView;
  heading: string;
  pendingLabel?: string;
}) {
  return (
    <article className="status-panel" data-paid={view.paid ? "yes" : "no"} data-mock={view.mock ? "yes" : "no"}>
      {view.mock ? <p className="mock-flag">MOCK</p> : null}
      <h1>{heading}</h1>
      <p className="lede">
        {view.found
          ? "This status was read from the server record. Return parameters are not treated as proof of payment."
          : "No server record matches that reference. A return parameter alone is not a payment."}
      </p>
      {view.ignoredQueryClaims.length > 0 ? (
        <p className="notice">
          A return parameter looked like a payment claim ({view.ignoredQueryClaims.join(", ")}). It was ignored.
        </p>
      ) : null}
      <dl className="spec-list">
        <div>
          <dt>Server status</dt>
          <dd>{view.status}</dd>
        </div>
        <div>
          <dt>Paid</dt>
          <dd>{view.paid ? "Yes" : "No"}</dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>{view.mode ?? "—"}</dd>
        </div>
      </dl>
      <p>{pendingLabel}</p>
      {view.mock ? <p>This MOCK record is not a paid order.</p> : null}
      {!view.paid && view.found && !view.mock ? <p>This order is not paid.</p> : null}
    </article>
  );
}
