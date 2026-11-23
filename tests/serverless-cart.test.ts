import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { nextCartLines, parseCartLines } from "@/lib/cart";
import { products } from "@/lib/catalog";
import { databaseFile } from "@/lib/db";

describe("serverless cart", () => {
  it("keeps cart lines in a cookie document and does not open sqlite to render them", () => {
    expect(parseCartLines(undefined)).toEqual([]);
    expect(parseCartLines("{")).toEqual([]);
    expect(parseCartLines(JSON.stringify([{ productId: "smp-red-cord", quantity: 1 }]))).toEqual([
      { productId: "smp-red-cord", quantity: 1 },
    ]);
    const lines = nextCartLines([], "smp-red-cord", 1, products);
    expect(lines).toEqual([{ productId: "smp-red-cord", quantity: 1 }]);
    expect(nextCartLines(lines, "smp-red-cord", 1, products)[0]?.quantity).toBe(2);
    expect(() => nextCartLines([], "missing", 1, products)).toThrow("unknown_product");

    const cartRoute = readFileSync("app/api/cart/route.ts", "utf8");
    const header = readFileSync("components/Header.tsx", "utf8");
    const cartPage = readFileSync("app/[locale]/cart/page.tsx", "utf8");
    expect(cartRoute).not.toContain("getDb");
    expect(header).not.toContain("getDb");
    expect(cartPage).not.toContain("getDb");
  });

  it("uses a temp file when the project data directory cannot be created", () => {
    const chosen = databaseFile({
      configured: "",
      cwd: "/var/task",
      tmpdir: "/tmp",
      writable: () => false,
    });
    expect(chosen).toBe("/tmp/fengshui-store.sqlite");
    expect(
      databaseFile({
        configured: "data/store.sqlite",
        cwd: "/var/task",
        tmpdir: "/tmp",
        writable: () => false,
      }),
    ).toBe("data/store.sqlite");
  });
});
