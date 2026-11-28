import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlessingDetail } from "@/components/BlessingDetail";
import { BlessingIndex } from "@/components/BlessingIndex";
import { ProductDetail } from "@/components/ProductDetail";
import { EXACT_DISCLAIMER, SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getServiceDraft } from "@/lib/places";

const banned = ["USD 50", "USD 300", "合作寺庙", "功德", "保佑", "灵验", "消灾", "改命", "partner temple", "3–7", "3-7"];

describe("offering lamp display", () => {
  it("shows four proposed prices and keeps booking closed", () => {
    const service = getServiceDraft("offering-lamps");
    if (!service) throw new Error("missing offering lamps");
    const english = renderToStaticMarkup(<BlessingDetail locale="en" service={service} />);
    const chinese = renderToStaticMarkup(<BlessingDetail locale="zh" service={service} />);
    const index = renderToStaticMarkup(<BlessingIndex locale="zh" />);
    for (const html of [english, chinese, index]) {
      expect(html).toContain("USD 29");
      expect(html).toContain("USD 49");
      expect(html).toContain("USD 99");
      expect(html).toContain("USD 199");
      expect(html).toContain("天下第一财神庙");
      expect(html).toContain("灵隐寺");
      for (const phrase of banned) expect(html).not.toContain(phrase);
      expect(html).not.toContain("<form");
      expect(html).not.toContain("<button");
      expect(html).not.toContain("<input");
      expect(html).not.toContain("大雄宝殿");
    }
    expect(english).toContain("Proposed");
    expect(english).toContain("1-day lamp");
    expect(english).toContain("7-day lamp");
    expect(english).toContain("49-day lamp");
    expect(english).toContain("annual lamp");
    expect(english).toContain("not both");
    expect(english).toContain("not a subscription");
    expect(english).toContain("does not renew by itself");
    expect(english).toContain("not confirmed");
    expect(english).toContain("Booking and payment are not open.");
    expect(english).toContain("cannot be purchased now");
    expect(english).toContain("We do not promise that a wish will come true.");
    expect(english).toContain("not an official temple partnership");
    expect(english).toContain("not a consecration");
    expect(english).toContain("灵顺寺");
    expect(chinese).toContain("写入登记册");
    expect(chinese).toContain("不是寺庙官方合作");
    expect(chinese).toContain("不构成开光");
    expect(chinese).toContain("灵顺寺，不是灵隐寺");
    expect(english).toContain(EXACT_DISCLAIMER);
    expect(english).toContain(SERVICE_DRAFT_DISCLAIMER);
    expect(english).toContain("/media/offering-lamps/lotus-pair.jpg");
    expect(english).toContain("/media/offering-lamps/lotus-stands.webp");
    expect(english).toContain("/media/offering-lamps/red-candles.jpg");
    expect(english).toContain("/media/offering-lamps/altar-row.jpg");
    expect(chinese).toContain("拟定");
    expect(chinese).toContain("一天灯");
    expect(chinese).toContain("七天灯");
    expect(chinese).toContain("四十九天灯");
    expect(chinese).toContain("常年灯");
    expect(chinese).toContain("不是两处");
    expect(chinese).toContain("不会自动续费");
    expect(chinese).toContain("尚未确认");
    expect(chinese).toContain("现在不能购买");
    expect(chinese).toContain("我们不承诺愿望会实现");
    expect(chinese).toContain(EXACT_DISCLAIMER);
    expect(chinese).toContain(SERVICE_DRAFT_DISCLAIMER);
    expect(index).toContain('href="/zh/blessing/offering-lamps"');
    expect(index).toContain("寺庙供灯代请服务");
  });

  it("does not put the lamp price or photos on a sample product", () => {
    const product = getProductBySlug("sample-red-cord-bracelet");
    if (!product) throw new Error("missing product");
    const html = renderToStaticMarkup(
      <ProductDetail product={product} related={getRelatedProducts(product)} locale="zh" />,
    );
    expect(html).not.toContain("USD 29");
    expect(html).not.toContain("USD 50");
    expect(html).not.toContain("USD 199");
    expect(html).not.toContain("USD 300");
    expect(html).not.toContain("/media/offering-lamps/");
    expect(html).not.toContain("<img");
  });
});
