import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CheckoutDesk } from "@/components/CheckoutDesk";
import { Footer } from "@/components/Footer";
import { ProductDetail, PRODUCT_MODULE_ORDER } from "@/components/ProductDetail";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { describeCheckout } from "@/lib/commerce/present";
import { EXACT_DISCLAIMER } from "@/lib/disclaimer";
import HomePage from "@/app/page";

describe("page structure", () => {
  it("keeps the product modules in the required order and prints the exact disclaimer", () => {
    const product = getProductBySlug("sample-red-cord-bracelet");
    if (!product) throw new Error("missing product");
    const html = renderToStaticMarkup(<ProductDetail product={product} related={getRelatedProducts(product)} />);
    const positions = PRODUCT_MODULE_ORDER.map((id) => html.indexOf(`data-module="${id}"`));
    expect(positions.every((position) => position >= 0)).toBe(true);
    for (let index = 1; index < positions.length; index += 1) {
      expect(positions[index]).toBeGreaterThan(positions[index - 1] ?? -1);
    }
    expect(PRODUCT_MODULE_ORDER).toEqual([
      "breadcrumb",
      "gallery",
      "purchase",
      "benefits",
      "trust",
      "specs",
      "use",
      "disclaimer",
      "faq",
      "related",
    ]);
    expect(html).toContain(EXACT_DISCLAIMER);
    expect(html).toContain("Add to cart");
    expect(html).toContain("Buy now");
  });

  it("orders the home page and shows the short footer disclaimer", () => {
    const html = renderToStaticMarkup(<HomePage />);
    const hero = html.indexOf('data-section="hero"');
    const featured = html.indexOf('data-section="featured"');
    const trust = html.indexOf('data-section="trust"');
    const faq = html.indexOf('data-section="faq"');
    expect(hero).toBeLessThan(featured);
    expect(featured).toBeLessThan(trust);
    expect(trust).toBeLessThan(faq);
    const footer = renderToStaticMarkup(<Footer />);
    expect(footer).toContain("For decorative &amp; cultural use only — no results guaranteed.");
    expect(footer).toContain("Full disclaimer.");
    expect(footer).toContain("TODO");
  });

  it("renders the disabled sandbox checkout state", () => {
    const state = describeCheckout({ configured: false, demoBlocked: true, liveDenied: false, empty: false });
    const html = renderToStaticMarkup(
      <CheckoutDesk state={state} clientId={null} currency="USD" demoBlocked />,
    );
    expect(html).toContain('data-payment-state="sandbox_not_connected"');
    expect(html).toContain("Sandbox not connected");
    expect(html).toContain("MOCK");
    expect(html).not.toContain("paypal.com/sdk");
  });
});
