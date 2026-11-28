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
  state: "empty" | "payments_closed";
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
  void input.configured;
  void input.demoBlocked;
  void input.liveDenied;
  if (input.empty) {
    return {
      state: "empty",
      buttonLabel: "Cart is empty",
      disabled: true,
      detail: "Payment is off.",
    };
  }
  return {
    state: "payments_closed",
    buttonLabel: "Payment is off",
    disabled: true,
    detail: "Payment is off.",
  };
}
