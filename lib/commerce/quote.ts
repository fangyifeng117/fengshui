import type { Product, StoredLine } from "@/lib/types";
import { centsToPayPal } from "@/lib/paypal/money";
import { publicConfig } from "@/lib/public-config";

export class CommerceError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export type QuoteLineInput = {
  productId: string;
  quantity: number;
  unitPriceCents?: number;
};

export type Quote = {
  items: StoredLine[];
  amountCents: number;
  currency: "USD";
  demoBlocked: boolean;
};

export function quoteLines(catalog: Product[], lines: QuoteLineInput[]): Quote {
  if (lines.length === 0) {
    throw new CommerceError("empty_cart", "Cart is empty.");
  }
  const items = lines.map((line) => {
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 9) {
      throw new CommerceError("invalid_quantity", "Quantity must be a whole number from 1 to 9.");
    }
    const product = catalog.find((item) => item.id === line.productId);
    if (!product) throw new CommerceError("unknown_product", "Unknown product.");
    if (product.currency !== "USD") {
      throw new CommerceError("unsupported_currency", "Only USD sample prices are supported.");
    }
    return {
      productId: product.id,
      slug: product.slug,
      title: product.title,
      quantity: line.quantity,
      unitAmountCents: product.price,
      currency: product.currency,
      sample: product.sample,
      captureAllowed: product.captureAllowed,
    } satisfies StoredLine;
  });
  const amountCents = items.reduce((sum, item) => sum + item.unitAmountCents * item.quantity, 0);
  return {
    items,
    amountCents,
    currency: "USD",
    demoBlocked: items.some((item) => item.sample || !item.captureAllowed),
  };
}

export function buildPayPalOrderBody(input: {
  orderId: string;
  currency: "USD";
  amountCents: number;
  items: StoredLine[];
  brandName?: string;
  returnUrl?: string;
  cancelUrl?: string;
}): Record<string, unknown> {
  const value = centsToPayPal(input.amountCents);
  const itemTotal = input.items.reduce((sum, item) => sum + item.unitAmountCents * item.quantity, 0);
  if (itemTotal !== input.amountCents) {
    throw new CommerceError("amount_mismatch", "Item total does not match the order amount.");
  }
  return {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: "default",
        custom_id: input.orderId,
        invoice_id: input.orderId,
        amount: {
          currency_code: input.currency,
          value,
          breakdown: {
            item_total: { currency_code: input.currency, value },
          },
        },
        items: input.items.map((item) => ({
          name: item.title.slice(0, 127),
          sku: item.productId.slice(0, 127),
          quantity: String(item.quantity),
          category: "PHYSICAL_GOODS",
          unit_amount: {
            currency_code: item.currency,
            value: centsToPayPal(item.unitAmountCents),
          },
        })),
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: input.brandName ?? publicConfig.brandName,
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: input.returnUrl,
          cancel_url: input.cancelUrl,
        },
      },
    },
  };
}
