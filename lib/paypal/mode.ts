export class PayPalModeError extends Error {
  code: "live_mode_denied" | "unsupported_mode";

  constructor(code: "live_mode_denied" | "unsupported_mode", message: string) {
    super(message);
    this.code = code;
  }
}

export function resolvePayPalMode(
  raw: string | undefined,
  nodeEnv: string,
): "sandbox" | "live" {
  const mode = !raw || raw.trim() === "" ? "sandbox" : raw.trim().toLowerCase();
  if (mode !== "sandbox" && mode !== "live") {
    throw new PayPalModeError("unsupported_mode", "PayPal mode must be sandbox or live.");
  }
  if (mode === "live" && nodeEnv !== "production") {
    throw new PayPalModeError(
      "live_mode_denied",
      "Live PayPal mode is denied outside production.",
    );
  }
  return mode;
}

export function paypalApiBase(mode: "sandbox" | "live"): string {
  return mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}
