import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CheckoutDesk } from "@/components/CheckoutDesk";
import { Footer } from "@/components/Footer";
import PrivacyPage from "@/app/[locale]/legal/privacy/page";
import TermsPage from "@/app/[locale]/legal/terms/page";
import { BRAND_NAME, publicConfig } from "@/lib/public-config";
import { copy } from "@/lib/i18n/messages";
import { ProductDetail, PRODUCT_MODULE_ORDER } from "@/components/ProductDetail";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/catalog";
import { describeCheckout } from "@/lib/commerce/present";
import { EXACT_DISCLAIMER, SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";
import { HomeScreen } from "@/components/HomeScreen";
import { generateMetadata as homeMetadata } from "@/app/[locale]/page";
import { generateMetadata as privacyMetadata } from "@/app/[locale]/legal/privacy/page";
import { SITE_TITLE } from "@/lib/seo";

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

  it("uses the site phrase as the document title", async () => {
    const english = await homeMetadata({ params: Promise.resolve({ locale: "en" }) });
    const chinese = await homeMetadata({ params: Promise.resolve({ locale: "zh" }) });
    const privacy = await privacyMetadata({ params: Promise.resolve({ locale: "en" }) });
    expect(english.title).toEqual({ absolute: SITE_TITLE.en });
    expect(chinese.title).toEqual({ absolute: SITE_TITLE.zh });
    expect(english.openGraph && "title" in english.openGraph ? english.openGraph.title : "").toBe(SITE_TITLE.en);
    expect(privacy.title).toEqual({ absolute: `Privacy — ${SITE_TITLE.en}` });
    expect(JSON.stringify(english)).not.toContain("Samples — Demo");
    expect(JSON.stringify(chinese)).not.toContain("样品 — Demo");
    expect(SITE_TITLE.en).toBe("Dongfang Furui — Blessings for a Lifetime");
    expect(SITE_TITLE.zh).toBe("东方福瑞，护佑一生");
    expect(publicConfig.brandName).toBe(BRAND_NAME);
    expect(BRAND_NAME).toBe("东方福瑞");
    expect(copy("en").brand.slogan).toBe("护佑一生");
    expect(copy("zh").brand.slogan).toBe("护佑一生");
    expect(JSON.stringify(english)).not.toContain("神秘东方");
    expect(JSON.stringify(english)).not.toContain("Furui Qifu");
    const css = readFileSync("app/globals.css", "utf8");
    expect(css).toContain("#4c1d6e");
    expect(css).toContain("#6b3a8c");
    expect(css).toContain("#2e1144");
    expect(css).toContain("#fac775");
    expect(css).not.toContain("#791f1f");
    expect(css).not.toContain("#a32d2d");
    expect(css).not.toContain("#501313");
    expect(JSON.stringify(getProducts())).not.toContain("护佑一生");
    expect(JSON.stringify(getProducts())).not.toContain("神秘东方");
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
    const heroHtml = html.slice(hero, featured);
    expect(heroHtml).toContain("Errand fee options");
    expect(heroHtml).toContain("Your wish, back home");
    expect(heroHtml).toContain("Proposed: 1-day lamp, USD 29");
    expect(heroHtml).toContain("Proposed: 7-day lamp, USD 49");
    expect(heroHtml).toContain("Proposed: 49-day lamp, USD 99");
    expect(heroHtml).toContain("Proposed: annual lamp, USD 199");
    expect(heroHtml).toContain("not for sale");
    expect(heroHtml).toContain('href="/blessing/offering-lamps"');
    expect(heroHtml).not.toContain("Shop the bracelet");
    expect(heroHtml).not.toContain("babao-liuli");
    expect(heroHtml).not.toContain("<form");
    expect(heroHtml).not.toContain("Add to cart");
    const featuredHtml = html.slice(featured, html.indexOf('data-section="lamps"'));
    expect(featuredHtml).toContain("/media/products/babao-liuli.jpg");
    expect(featuredHtml).toContain("/media/products/goat-year-red-string-coiled-calligraphy.jpg");
    const chinese = renderToStaticMarkup(<HomeScreen locale="zh" />);
    const zhHero = chinese.slice(chinese.indexOf('data-section="hero"'), chinese.indexOf('data-section="featured"'));
    expect(zhHero).toContain("代请费用选项");
    expect(zhHero).toContain("你的心愿，回到家乡");
    expect(zhHero).toContain("拟定：一天灯，USD 29");
    expect(zhHero).toContain("拟定：七天灯，USD 49");
    expect(zhHero).toContain("拟定：四十九天灯，USD 99");
    expect(zhHero).toContain("拟定：常年灯，USD 199");
    expect(zhHero.match(/现在不能购买/g)?.length).toBe(4);
    expect(zhHero).toContain('href="/zh/blessing/offering-lamps"');
    expect(zhHero).not.toContain("选购手串");
    expect(zhHero).not.toContain("babao-liuli");
    expect(zhHero).not.toContain("护佑一生");
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
