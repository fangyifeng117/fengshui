import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HomeScreen } from "@/components/HomeScreen";
import { ProductDetail } from "@/components/ProductDetail";
import { EXACT_DISCLAIMER, SERVICE_DRAFT_DISCLAIMER } from "@/lib/disclaimer";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { PAYMENTS_OPEN } from "@/lib/commerce/gate";
import { imageFilePresent } from "@/lib/media";

describe("Year of the Goat red string", () => {
  it("lists the coiled cord with two photographs and no stock count", () => {
    expect(PAYMENTS_OPEN).toBe(false);
    const product = getProductBySlug("goat-year-red-string-coiled");
    if (!product) throw new Error("missing cord");
    expect(product.sample).toBe(true);
    expect(product.captureAllowed).toBe(false);
    expect(product.publicListing).toBe(true);
    expect(product.quantityKnown).toBe(false);
    expect(product.price).toBe(3000);
    expect(product.materials).toEqual(["braided cord"]);
    expect(product.images.map((image) => image.src)).toEqual([
      "/media/products/goat-year-red-string-coiled-calligraphy.jpg",
      "/media/products/goat-year-red-string-coiled-greenery.jpg",
    ]);

    const english = renderToStaticMarkup(
      <ProductDetail product={product} related={getRelatedProducts(product)} />,
    );
    const chinese = renderToStaticMarkup(
      <ProductDetail product={product} related={getRelatedProducts(product)} locale="zh" />,
    );
    for (const html of [english, chinese]) {
      expect(html).toContain("USD 30");
      expect(html).toContain(EXACT_DISCLAIMER);
      expect(html).toContain(SERVICE_DRAFT_DISCLAIMER);
      expect(html).not.toContain("<form");
      expect(html).not.toContain("<button");
      expect(html).not.toContain("本命年");
      expect(html).not.toContain("灵隐寺");
      expect(html).not.toContain("灵顺寺");
      expect(html).not.toContain("USD 188");
      const ready = product.images.every((image) => imageFilePresent(image.src));
      expect(html.match(/<img/g)?.length ?? 0).toBe(ready ? product.images.length : 0);
      for (const image of product.images) {
        if (ready) expect(html).toContain(image.src);
        else expect(html).not.toContain(image.src);
      }
    }
    expect(english).toContain("Year of the Goat Red String (Gold-and-Red Coil)");
    expect(english).toContain("Quantity not confirmed");
    expect(english).toContain("not an official temple service");
    expect(english).toContain("does not guarantee any outcome");
    expect(english).not.toContain(" on hand");
    expect(english).not.toMatch(/\bfree\b/i);
    expect(chinese).toContain("羊年红绳（金红缠绕）");
    expect(chinese).toContain("编织红绳");
    expect(chinese).toContain("数量未确认");
    expect(chinese).toContain("代请代办");
    expect(chinese).toContain("不是开光");
    expect(chinese).not.toContain("库存 0");
    expect(chinese).not.toContain("包邮");

    const home = renderToStaticMarkup(<HomeScreen locale="zh" />);
    expect(home).toContain("羊年红绳（金红缠绕）");
    expect(home).toContain("USD 30");
    expect(home).toContain("待上架");
    expect(home).not.toContain("本命年");
    expect(home).not.toContain("已上新");
  });
});
