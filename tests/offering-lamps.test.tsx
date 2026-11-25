import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlessingDetail } from "@/components/BlessingDetail";
import { BlessingIndex } from "@/components/BlessingIndex";
import { ProductDetail } from "@/components/ProductDetail";
import { EXACT_DISCLAIMER, SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getServiceDraft } from "@/lib/places";

describe("offering lamp display", () => {
  it("shows both prices on the lamp page and keeps booking closed", () => {
    const service = getServiceDraft("offering-lamps");
    if (!service) throw new Error("missing offering lamps");
    const english = renderToStaticMarkup(<BlessingDetail locale="en" service={service} />);
    const chinese = renderToStaticMarkup(<BlessingDetail locale="zh" service={service} />);
    const index = renderToStaticMarkup(<BlessingIndex locale="zh" />);
    for (const html of [english, chinese, index]) {
      expect(html).toContain("USD 50");
      expect(html).toContain("USD 300");
      expect(html).toContain("12");
      expect(html).not.toContain("USD 25");
      expect(html).not.toContain("每月 300");
      expect(html).not.toContain("大雄宝殿");
      expect(html).not.toContain("功德");
      expect(html).not.toContain("<form");
      expect(html).not.toContain("<button");
      expect(html).not.toContain("<input");
    }
    expect(english).toContain("not charged each month");
    expect(english).toContain("does not renew by itself");
    expect(chinese).toContain("不是每月收取");
    expect(chinese).toContain("不会自动续费");
    expect(chinese).toContain("服务展示，暂未开放预约/支付");
    expect(english).toContain("Booking and payment are not open.");
    expect(english).toContain(EXACT_DISCLAIMER);
    expect(english).toContain(SERVICE_DRAFT_DISCLAIMER);
    expect(english).toContain("/media/offering-lamps/lotus-pair.jpg");
    expect(english).toContain("/media/offering-lamps/lotus-stands.webp");
    expect(english).toContain("/media/offering-lamps/red-candles.jpg");
    expect(english).toContain("/media/offering-lamps/altar-row.jpg");
    expect(index).toContain('href="/zh/blessing/offering-lamps"');
  });

  it("does not put the lamp price or photos on a sample product", () => {
    const product = getProductBySlug("sample-red-cord-bracelet");
    if (!product) throw new Error("missing product");
    const html = renderToStaticMarkup(
      <ProductDetail product={product} related={getRelatedProducts(product)} locale="zh" />,
    );
    expect(html).not.toContain("USD 50");
    expect(html).not.toContain("USD 300");
    expect(html).not.toContain("/media/offering-lamps/");
    expect(html).not.toContain("<img");
  });
});
