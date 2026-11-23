import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CartEditor } from "@/components/CartEditor";
import { HomeScreen } from "@/components/HomeScreen";
import { OrderStatusPanel } from "@/components/OrderStatusPanel";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/ProductDetail";
import ProductsPage from "@/app/[locale]/products/page";
import { publicCartPayload, quoteCart } from "@/lib/cart";
import { getProductBySlug, getProducts, getRelatedProducts, products } from "@/lib/catalog";
import { copy } from "@/lib/i18n/messages";
import { productJsonLd } from "@/lib/seo";

const priceLeak = /\$\d|\b\d+\.\d{2}\b|\/illustrations\/|unitAmountCents|amountCents|"price"/;

describe("withheld sample pictures and prices", () => {
  it("keeps the catalog prices and image paths while the public pages omit both", async () => {
    for (const product of products) {
      expect(product.price).toBeGreaterThan(0);
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.images[0]?.src.startsWith("/illustrations/")).toBe(true);
    }

    const product = getProductBySlug("sample-red-cord-bracelet");
    if (!product) throw new Error("missing product");
    const pages = [
      renderToStaticMarkup(<HomeScreen />),
      renderToStaticMarkup(<HomeScreen locale="zh" />),
      renderToStaticMarkup(<ProductCard product={product} />),
      renderToStaticMarkup(<ProductCard product={product} locale="zh" />),
      renderToStaticMarkup(<ProductDetail product={product} related={getRelatedProducts(product)} />),
      renderToStaticMarkup(<ProductDetail product={product} related={getRelatedProducts(product)} locale="zh" />),
      renderToStaticMarkup(
        <CartEditor locale="en" items={[{ productId: product.id, slug: product.slug, title: product.title, quantity: 1 }]} />,
      ),
      renderToStaticMarkup(
        <CartEditor locale="zh" items={[{ productId: product.id, slug: product.slug, title: "样品红绳手串", quantity: 1 }]} />,
      ),
      renderToStaticMarkup(
        await ProductsPage({
          params: Promise.resolve({ locale: "en" }),
          searchParams: Promise.resolve({ under: "30" }),
        }),
      ),
      renderToStaticMarkup(
        await ProductsPage({
          params: Promise.resolve({ locale: "zh" }),
          searchParams: Promise.resolve({}),
        }),
      ),
    ];
    expect(pages[4]).toContain('data-module="gallery"');
    expect(pages[4]).toContain("Details to be confirmed");
    expect(pages[5]).toContain("商品资料待确认");
    expect(pages[8]).toContain("Sample Decorative Object");
    expect(pages[8]).not.toContain("$30");
    expect(pages[0]).toContain("/media/themes/roof.jpg");
    expect(pages[0]).toContain("/media/themes/bracelet.jpg");
    expect(pages[0]).toContain("wrist-sized bead bracelet");
    expect(pages[0]).not.toContain("hanging from a stick");
    expect(pages[1]).toContain("手腕尺寸珠串");
    expect(pages[1]).not.toContain("木珠串");
    expect(pages[0]).toContain("/media/themes/lamps.jpg");
    expect(pages[0]).toContain("Style reference");
    expect(pages[0]).toContain("Not a sample for sale");
    expect(pages[1]).toContain("风格示意");
    expect(pages[1]).toContain("不是在售样品");
    expect(pages[1]).toContain("供灯服务没有开通");
    for (const html of pages.slice(2)) {
      expect(html).not.toContain("<img");
      expect(html).not.toContain("/media/themes/");
    }
    for (const html of pages) {
      expect(html).not.toMatch(priceLeak);
      expect(html).not.toContain("free");
      expect(html).not.toContain("免费");
      expect(html).not.toContain("BRAND_NAME");
      expect(html).not.toContain("大雄宝殿");
    }

    const quote = quoteCart(products, { id: "cart_test", version: 0, lines: [{ productId: product.id, quantity: 1 }] });
    const payload = publicCartPayload(quote, "cart_test", 0);
    expect(JSON.stringify(payload)).not.toMatch(/amount|price|2800|currency/);
    expect(payload.items[0]?.quantity).toBe(1);

    const jsonLd = productJsonLd({
      name: product.title,
      description: copy("en").product.pending,
      sku: product.id,
      url: "http://127.0.0.1:3000/products/sample-red-cord-bracelet",
      brandName: "BRAND_NAME",
    });
    expect(JSON.stringify(jsonLd)).not.toMatch(/offers|image|28\.00/);

    const status = renderToStaticMarkup(
      <OrderStatusPanel
        heading="Not paid"
        pendingLabel="Details to be confirmed"
        view={{
          found: true,
          paid: false,
          mock: false,
          status: "created",
          amountCents: 2800,
          currency: "USD",
          mode: "sandbox",
          items: [],
          ignoredQueryClaims: [],
        }}
      />,
    );
    expect(status).toContain("Details to be confirmed");
    expect(status).not.toContain("28");
    expect(status).not.toContain("$");
    expect(getProducts()).toHaveLength(products.length);
  });
});
