import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/ProductDetail";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/catalog";

describe("Babao Liuli Bracelet", () => {
  it("shows the photograph, USD 188, and 10 only for this bracelet", () => {
    const product = getProductBySlug("babao-liuli-bracelet");
    if (!product) throw new Error("missing bracelet");
    expect(product.publicListing).toBe(true);
    expect(product.sample).toBe(true);
    expect(product.captureAllowed).toBe(false);
    expect(product.price).toBe(18800);
    expect(product.illustrativeQuantity).toBe(10);
    expect(product.materials).toEqual(["liuli"]);

    const english = renderToStaticMarkup(
      <ProductDetail product={product} related={getRelatedProducts(product)} />,
    );
    const chinese = renderToStaticMarkup(
      <ProductDetail product={product} related={getRelatedProducts(product)} locale="zh" />,
    );
    const card = renderToStaticMarkup(<ProductCard product={product} locale="zh" />);
    for (const html of [english, chinese, card]) {
      expect(html).toContain("USD 188");
      expect(html).toContain("/media/products/babao-liuli.jpg");
      expect(html).not.toContain("<button");
      expect(html).not.toContain("<form");
      expect(html).not.toContain("香灰");
      expect(html).not.toContain("开光");
    }
    const ownCopy = JSON.stringify({
      description: product.description,
      seo: product.seo,
      benefits: product.benefits,
      useNotes: product.useNotes,
      faq: product.faq,
      specs: product.specs,
    });
    expect(ownCopy).not.toMatch(/\bwealth\b|\bfortune\b|\blucky\b|\bmoney\b|\btemple\b/i);
    expect(english).toContain("10 on hand");
    expect(english).toContain("Payment is off. There is no cart button.");
    expect(english).toContain("traditional good wish");
    expect(chinese).toContain("八宝琉璃手串");
    expect(chinese).toContain("库存 10 件");
    expect(chinese).toContain("祈福与招财");
    expect(chinese).toContain("文化象征");
    expect(chinese).toContain("待确认");
    expect(english.match(/<img/g)?.length).toBe(1);

    for (const other of products.filter((item) => item.id !== product.id && item.id !== "goat-year-red-string")) {
      const html = renderToStaticMarkup(<ProductCard product={other} />);
      expect(html).not.toContain("<img");
      expect(html).not.toContain("USD 188");
    }
  });
});
