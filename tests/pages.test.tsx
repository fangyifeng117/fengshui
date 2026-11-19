import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CheckoutDesk } from "@/components/CheckoutDesk";
import { Footer } from "@/components/Footer";
import PrivacyPage from "@/app/[locale]/legal/privacy/page";
import TermsPage from "@/app/[locale]/legal/terms/page";
import { publicConfig } from "@/lib/public-config";
import { ProductDetail, PRODUCT_MODULE_ORDER } from "@/components/ProductDetail";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { describeCheckout } from "@/lib/commerce/present";
import { EXACT_DISCLAIMER } from "@/lib/disclaimer";
import { HomeScreen } from "@/components/HomeScreen";

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
    expect(html).toContain("View demo checkout");
  });

  it("orders the home page and shows the short footer disclaimer", () => {
    const html = renderToStaticMarkup(<HomeScreen />);
    const hero = html.indexOf('data-section="hero"');
    const featured = html.indexOf('data-section="featured"');
    const places = html.indexOf('data-section="places"');
    const faq = html.indexOf('data-section="faq"');
    expect(hero).toBeLessThan(featured);
    expect(featured).toBeLessThan(places);
    expect(places).toBeLessThan(faq);
    expect(html).toContain("Wutai Mountain");
    expect(html).toContain("Not a specific temple, and not an authorized partnership.");
    expect(html).toContain("Are the pictures of real stock?");
    const footer = renderToStaticMarkup(<Footer />);
    expect(footer).toContain("For decorative &amp; cultural use only — no results guaranteed.");
    expect(footer).toContain("Full disclaimer.");
    expect(footer).toContain("Draft. Legal entity, phone number, street address, and domain are not confirmed.");
    expect(footer).not.toContain("TODO");
    expect(footer).toContain(`mailto:${publicConfig.supportEmail}`);
    expect(footer).toContain("Customer support:");
    expect(footer).toContain("Legal entity");
  });

  it("uses the support address for shop questions and does not appoint a privacy contact", () => {
    expect(publicConfig.supportEmail).toBe("fangyifeng117@gmail.com");
    const terms = renderToStaticMarkup(<TermsPage />);
    expect(terms).toContain(`mailto:${publicConfig.supportEmail}`);
    expect(terms).toContain("TODO");
    const privacy = renderToStaticMarkup(<PrivacyPage />);
    expect(privacy).toContain("Draft, awaiting confirmation");
    expect(privacy).toContain("not designated as a privacy contact or a DPO");
    expect(privacy).toContain("No privacy contact and no data-protection officer have been appointed");
  });

  it("renders checkout as a closed test preview", () => {
    const closed = describeCheckout({ configured: true, demoBlocked: false, liveDenied: false, empty: false });
    const html = renderToStaticMarkup(<CheckoutDesk state={closed} />);
    expect(html).toContain('data-payment-state="payments_closed"');
    expect(html).toContain("Payment is off");
    expect(html).toContain("This test preview cannot take payment.");
    expect(html).not.toContain("paypal.com/sdk");
  });
});
