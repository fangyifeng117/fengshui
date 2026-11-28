import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AboutPage from "@/app/[locale]/about/page";
import PrivacyPage from "@/app/[locale]/legal/privacy/page";
import TermsPage from "@/app/[locale]/legal/terms/page";
import ShippingPage from "@/app/[locale]/shipping/page";
import { HomeScreen } from "@/components/HomeScreen";
import { ProductDetail } from "@/components/ProductDetail";
import { PAYMENTS_OPEN } from "@/lib/commerce/gate";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { merchantIdentity } from "@/lib/merchant";
import robots from "@/app/robots";

const secretMarkers = ["统一社会信用代码", "法定代表人", "注册资本"];

describe("merchant legal drafts", () => {
  it("writes Chinese privacy, terms, and shipping with the seller and keeps payment closed", async () => {
    expect(PAYMENTS_OPEN).toBe(false);
    const privacy = renderToStaticMarkup(await PrivacyPage({ params: Promise.resolve({ locale: "zh" }) }));
    const terms = renderToStaticMarkup(await TermsPage({ params: Promise.resolve({ locale: "zh" }) }));
    const shipping = renderToStaticMarkup(await ShippingPage({ params: Promise.resolve({ locale: "zh" }) }));
    for (const html of [privacy, terms, shipping]) {
      expect(html).toContain(merchantIdentity.legalName);
      expect(html).toContain(merchantIdentity.address);
      expect(html).toContain("fangyifeng117@gmail.com");
      expect(html).not.toContain("TODO");
      expect(html).not.toContain("This demonstration");
      for (const marker of secretMarkers) expect(html).not.toContain(marker);
    }
    expect(privacy).toContain("隐私");
    expect(privacy).toContain("不限于美国");
    expect(privacy).toContain("写入登记册");
    expect(privacy).toContain("不出售");
    expect(privacy).not.toContain("<form");
    expect(terms).toContain("全球");
    expect(terms).toContain("拟定展示");
    expect(terms).toContain("不能购买");
    expect(terms).not.toContain("USD 50");
    expect(terms).not.toContain("USD 300");
    expect(shipping).toContain("1–3");
    expect(shipping).toContain("7–15");
    expect(shipping).toContain("包邮");
    expect(shipping).toContain("收件人承担");
    expect(shipping).not.toContain("任何情形都不退");
    expect(robots().rules).toMatchObject({ disallow: "/" });
  });

  it("does not headline the legal name on the home, about, or bracelet marketing", async () => {
    const home = renderToStaticMarkup(<HomeScreen locale="zh" />);
    const about = renderToStaticMarkup(await AboutPage({ params: Promise.resolve({ locale: "zh" }) }));
    const product = getProductBySlug("babao-liuli-bracelet");
    if (!product) throw new Error("missing bracelet");
    const detail = renderToStaticMarkup(
      <ProductDetail product={product} related={getRelatedProducts(product)} locale="zh" />,
    );
    for (const html of [home, about, detail]) {
      expect(html).not.toContain(merchantIdentity.legalName);
    }
    expect(about).toContain("福瑞祈福");
    expect(about).not.toContain("神秘东方");
    expect(about).not.toContain("东方福瑞");
    expect(about).not.toContain("文福瑞");
    expect(about).not.toContain("护佑一生");
    expect(detail).toContain("杭州");
    expect(detail).not.toContain("<button");
  });
});
