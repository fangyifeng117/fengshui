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
import { EXACT_DISCLAIMER, SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";
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
    expect(html).toContain(SERVICE_DRAFT_DISCLAIMER);
    expect(html).toContain("Details to be confirmed");
    expect(html).not.toContain("Add to cart");
    expect(html).not.toContain("/illustrations/");
    expect(html).not.toMatch(/\$\d/);
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
    expect(footer).toContain("杭州蜂鸟社信息科技有限公司");
    expect(footer).toContain("浙江省杭州市余杭区五常街道联创街133号1幢5001-1室");
    expect(footer).not.toContain("not confirmed");
    expect(footer).not.toContain("TODO");
    expect(footer).toContain(`mailto:${publicConfig.supportEmail}`);
    expect(footer).toContain("Customer support:");
    expect(footer).toContain("https://furuiqifu.com");
  });

  it("uses the support address as the privacy contact on the merchant draft", async () => {
    expect(publicConfig.supportEmail).toBe("fangyifeng117@gmail.com");
    const terms = renderToStaticMarkup(await TermsPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(terms).toContain(`mailto:${publicConfig.supportEmail}`);
    expect(terms).toContain("worldwide");
    expect(terms).not.toContain("TODO");
    const privacy = renderToStaticMarkup(await PrivacyPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(privacy).toContain("杭州蜂鸟社信息科技有限公司");
    expect(privacy).toContain("Privacy questions use the customer-service email above.");
    expect(privacy).not.toContain("TODO");
  });

  it("renders checkout as a closed test preview", () => {
    const closed = describeCheckout({ configured: true, demoBlocked: false, liveDenied: false, empty: false });
    const html = renderToStaticMarkup(<CheckoutDesk state={closed} />);
    expect(html).toContain('data-payment-state="payments_closed"');
    expect(html).toContain("Payment is off");
    expect(html).toContain("Payment is off.");
    expect(html).not.toContain("paypal.com/sdk");
  });
});
