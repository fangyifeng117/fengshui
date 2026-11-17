"use client";

import { useEffect, useRef, useState } from "react";

type PayPalButtons = {
  render: (element: HTMLElement) => Promise<void> | void;
};

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID?: string }) => Promise<void>;
        onCancel: () => void;
      }) => PayPalButtons;
    };
  }
}

export function PayPalHandoff({ clientId, currency }: { clientId: string; currency: "USD" }) {
  const host = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${currency}&intent=capture&commit=true&disable-funding=card,credit,venmo,paylater`;
    script.async = true;
    script.onload = async () => {
      if (cancelled || !window.paypal || !element) return;
      let internalOrderId = "";
      await window.paypal
        .Buttons({
          createOrder: async () => {
            const response = await fetch("/api/checkout", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ action: "create" }),
            });
            const payload = (await response.json()) as { paypalOrderId?: string; orderId?: string; code?: string };
            if (!response.ok || !payload.paypalOrderId || !payload.orderId) {
              throw new Error(payload.code || "create_failed");
            }
            internalOrderId = payload.orderId;
            return payload.paypalOrderId;
          },
          onApprove: async (data) => {
            const response = await fetch("/api/checkout", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                action: "capture",
                orderId: internalOrderId,
                paypalOrderId: data.orderID,
              }),
            });
            if (!response.ok) {
              setMessage("PayPal returned control to this site, but the server did not mark the order paid.");
              return;
            }
            window.location.href = `/order/success?order=${encodeURIComponent(internalOrderId)}`;
          },
          onCancel: () => {
            const suffix = internalOrderId ? `?order=${encodeURIComponent(internalOrderId)}` : "";
            window.location.href = `/order/cancel${suffix}`;
          },
        })
        .render(element);
    };
    script.onerror = () => setMessage("The PayPal script did not load. No payment was started.");
    document.body.appendChild(script);
    return () => {
      cancelled = true;
      script.remove();
    };
  }, [clientId, currency]);

  return (
    <div className="paypal-handoff">
      <div ref={host} />
      {message ? <p className="form-error">{message}</p> : null}
    </div>
  );
}
