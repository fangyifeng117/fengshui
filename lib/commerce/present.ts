import type { StoredOrder } from "@/lib/types";

export type OrderView = {
  found: boolean;
  paid: boolean;
  mock: boolean;
  status: string;
  amountCents: number | null;
  currency: "USD" | null;
  mode: string | null;
  items: StoredOrder["items"];
  ignoredQueryClaims: string[];
};

const IGNORED_KEYS = ["paid", "status", "token", "PayerID", "paymentId", "payment_status"];

export function presentOrder(
  order: StoredOrder | null,
  query: Record<string, string | undefined>,
): OrderView {
  const ignoredQueryClaims = IGNORED_KEYS.filter((key) => query[key] != null && query[key] !== "");
  if (!order) {
    return {
      found: false,
      paid: false,
      mock: false,
      status: "unverified",
      amountCents: null,
      currency: null,
      mode: null,
      items: [],
      ignoredQueryClaims,
    };
  }
  const mock = order.kind === "mock" || order.mode === "mock" || order.status === "mock_demonstration";
  const paid = !mock && order.status === "paid";
  return {
    found: true,
    paid,
    mock,
    status: order.status,
    amountCents: order.amountCents,
    currency: order.currency,
    mode: order.mode,
    items: order.items,
    ignoredQueryClaims,
  };
}

export type CheckoutDeskState = {
  state: "empty" | "live_denied" | "sandbox_not_connected" | "demo_blocked" | "ready";
  buttonLabel: string;
  disabled: boolean;
  detail: string;
};

export function describeCheckout(input: {
  configured: boolean;
  demoBlocked: boolean;
  liveDenied: boolean;
  empty: boolean;
}): CheckoutDeskState {
  if (input.empty) {
    return {
      state: "empty",
      buttonLabel: "Cart empty",
      disabled: true,
      detail: "Add a sample before opening payment.",
    };
  }
  if (input.liveDenied) {
    return {
      state: "live_denied",
      buttonLabel: "Live mode blocked",
      disabled: true,
      detail: "Live PayPal mode is denied outside production. No payment was sent.",
    };
  }
  if (!input.configured) {
    return {
      state: "sandbox_not_connected",
      buttonLabel: "Sandbox not connected",
      disabled: true,
      detail:
        "PayPal Orders API credentials are not configured. This control does not start a payment. No approval or capture has been run.",
    };
  }
  if (input.demoBlocked) {
    return {
      state: "demo_blocked",
      buttonLabel: "Demo items cannot be captured",
      disabled: true,
      detail: "Sample SKUs are blocked from genuine PayPal capture. Replace them with real products before taking payment.",
    };
  }
  return {
    state: "ready",
    buttonLabel: "Continue to PayPal",
    disabled: false,
    detail: "You would leave this site for PayPal to approve the order. Card numbers are not collected here.",
  };
}
