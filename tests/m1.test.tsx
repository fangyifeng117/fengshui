import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlessingDetail } from "@/components/BlessingDetail";
import { BlessingIndex } from "@/components/BlessingIndex";
import { CartEditor } from "@/components/CartEditor";
import { Footer } from "@/components/Footer";
import { HomeScreen } from "@/components/HomeScreen";
import { PlaceDetail } from "@/components/PlaceDetail";
import { PlacesIndex } from "@/components/PlacesIndex";
import { ProductDetail } from "@/components/ProductDetail";
import { getProductBySlug, getProducts, getRelatedProducts, collections } from "@/lib/catalog";
import { EXACT_DISCLAIMER, SERVICE_DRAFT_DISCLAIMER, SHORT_FOOTER_DISCLAIMER, ZH_EXACT_DISCLAIMER, ZH_SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";
import { displayPhrase, zhCatalogCovers } from "@/lib/i18n/display";
import { copy } from "@/lib/i18n/messages";
import { homeCopy } from "@/lib/home-copy";
import { routing } from "@/i18n/routing";
import { hrefFor } from "@/lib/locale";
import { getPlace, places, serviceDrafts } from "@/lib/places";

const forbidden = [
  /Presented at/i,
  /real temple footage/i,
  /every piece traces back/i,
  /大雄宝殿/,
];

describe("M1 bilingual skeleton", () => {
  it("keeps English URLs unprefixed and prefixes Chinese", () => {
    expect(hrefFor("en", "/temples")).toBe("/temples");
    expect(hrefFor("en", "/")).toBe("/");
    expect(hrefFor("zh", "/")).toBe("/zh");
    expect(hrefFor("zh", "/temples/wutai")).toBe("/zh/temples/wutai");
    expect(routing.localePrefix).toBe("as-needed");
    expect(routing.localeDetection).toBe(false);
  });

  it("lists the five cultural places and marks Xuedou as unverified", () => {
    expect(places.map((place) => place.slug)).toEqual(["wutai", "emei", "putuo", "jiuhua", "xuedou"]);
    expect(getPlace("xuedou")?.regionPending).toBe(true);
    const html = renderToStaticMarkup(<PlacesIndex locale="zh" />);
    expect(html).toContain("五台山");
    expect(html).toContain("资料待核实");
    expect(html).toContain("不是具体寺院");
    expect(html).toContain('href="/zh/temples/wutai"');
  });

  it("shows inspired-by samples and a non-purchasable blessing draft", () => {
    const place = getPlace("wutai");
    if (!place) throw new Error("missing place");
    const placeHtml = renderToStaticMarkup(<PlaceDetail locale="en" place={place} />);
    expect(placeHtml).toContain("Not a record of origin");
    expect(placeHtml).toContain("Sample Red Cord Bracelet");
    const blessing = renderToStaticMarkup(<BlessingIndex locale="en" />);
    expect(blessing).toContain(SERVICE_DRAFT_DISCLAIMER);
    expect(blessing).not.toContain("<form");
    expect(blessing).not.toContain("<input");
    const service = serviceDrafts[0];
    if (!service) throw new Error("missing service");
    const detail = renderToStaticMarkup(<BlessingDetail locale="zh" service={service} />);
    expect(detail).toContain("即将推出");
    expect(detail).toContain(SERVICE_DRAFT_DISCLAIMER);
    expect(detail).not.toContain("<form");
    const blob = JSON.stringify({ places, serviceDrafts, blessing, detail });
    for (const pattern of forbidden) expect(blob.match(pattern)).toBeNull();
    expect(blessing).toContain("Not for sale");
    expect(blessing).toContain("Draft: not on sale yet.");
    expect(detail).toContain("尚未开售");
    expect(detail).toContain("不能购买");
    expect(detail).toContain(ZH_SERVICE_DRAFT_DISCLAIMER);
  });

  it("shows five mountain links on both homepages and keeps the FAQ meanings aligned", () => {
    const english = renderToStaticMarkup(<HomeScreen />);
    const chinese = renderToStaticMarkup(<HomeScreen locale="zh" />);
    for (const name of ["Wutai Mountain", "Emei Mountain", "Putuo Mountain", "Jiuhua Mountain", "Xuedou Mountain"]) {
      expect(english).toContain(name);
    }
    for (const name of ["五台山", "峨眉山", "普陀山", "九华山", "雪窦山"]) {
      expect(chinese).toContain(name);
      expect(chinese).toContain(`>${name}</a>`);
    }
    expect(chinese).toContain('href="/zh/temples/xuedou"');
    expect(chinese).toContain("不是具体寺院");
    expect(chinese).not.toContain("大雄宝殿");
    expect(copy("en").faq.pictures).toBe(homeCopy.faq[1]?.question);
    expect(copy("en").faq.picturesAnswer).toBe(homeCopy.faq[1]?.answer);
    expect(copy("zh").faq.pictures).toBe("图片是真实库存吗？");
    expect(copy("zh").faq.pictures).not.toContain("真实地方");
    expect(copy("zh").faq.picturesAnswer).toContain("参考照片");
    expect(copy("zh").faq.picturesAnswer).toContain("不是在售商品");
    expect(chinese).toContain("图片是真实库存吗？");
    expect(english).toContain("Are the pictures of real stock?");
  });

  it("translates the Chinese catalog and keeps the fixed disclaimers", () => {
    expect(SHORT_FOOTER_DISCLAIMER).toBe("For decorative & cultural use only — no results guaranteed. Full disclaimer.");
    expect(EXACT_DISCLAIMER.startsWith("Disclaimer: Products and content on this site")).toBe(true);
    expect(SERVICE_DRAFT_DISCLAIMER.startsWith("Sold as a cultural craft")).toBe(true);
    expect(zhCatalogCovers(getProducts().map((product) => product.id), collections.map((item) => item.slug))).toBe(true);
    const product = getProductBySlug("sample-red-cord-bracelet");
    if (!product) throw new Error("missing product");
    const english = renderToStaticMarkup(<ProductDetail product={product} related={getRelatedProducts(product)} />);
    const chinese = renderToStaticMarkup(
      <ProductDetail product={product} related={getRelatedProducts(product)} locale="zh" />,
    );
    expect(english).toContain("Sample Red Cord Bracelet");
    expect(english).toContain("About this sample");
    expect(english).toContain(EXACT_DISCLAIMER);
    expect(english).toContain(SERVICE_DRAFT_DISCLAIMER);
    expect(english).not.toContain(ZH_EXACT_DISCLAIMER);
    expect(english).not.toContain(ZH_SERVICE_DRAFT_DISCLAIMER);
    expect(chinese).toContain("样品红绳手串");
    expect(chinese).toContain("绳编手串");
    expect(chinese).toContain("样品");
    expect(chinese).toContain(EXACT_DISCLAIMER);
    expect(chinese).toContain(SERVICE_DRAFT_DISCLAIMER);
    expect(chinese).toContain(ZH_EXACT_DISCLAIMER);
    expect(chinese).toContain(ZH_SERVICE_DRAFT_DISCLAIMER);
    expect(chinese).not.toContain("About this sample");
    for (const item of getProducts()) {
      for (const spec of item.specs) {
        expect(displayPhrase(spec.label, item, "zh")).not.toBe(spec.label);
        expect(displayPhrase(spec.value, item, "zh")).not.toBe(spec.value);
      }
    }
    const footer = renderToStaticMarkup(<Footer locale="zh" />);
    expect(footer).toContain("For decorative &amp; cultural use only — no results guaranteed.");
    expect(footer).toContain("Full disclaimer.");
    expect(footer).toContain("仅供装饰与文化用途，不保证任何结果。");
    expect(footer).toContain("完整免责声明。");
    expect(footer).toContain("绳编手串");
    expect(footer).not.toContain("Cord bracelets");
    const cart = renderToStaticMarkup(
      <CartEditor
        locale="zh"
        items={[
          {
            productId: product.id,
            slug: product.slug,
            title: "样品红绳手串",
            quantity: 1,
          },
        ]}
      />,
    );
    expect(cart).toContain("移除");
    expect(cart).toContain("商品资料待确认");
    expect(cart).toContain("样品红绳手串");
    expect(cart).not.toContain("28.00");
    expect(cart).not.toContain("/illustrations/");
  });
});
