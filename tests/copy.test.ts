import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { products, collections } from "@/lib/catalog";
import { contentPages } from "@/lib/content";
import { EXACT_DISCLAIMER } from "@/lib/disclaimer";
import { homeCopy, trustBadges } from "@/lib/home-copy";

const banned = [
  /\bcure[sd]?\b/i,
  /\bheal(?:ing|s|ed)?\b/i,
  /\battract(?:s|ed|ing)?\b/i,
  /\bdestiny\b/i,
  /\blucky\b/i,
  /\bblessed\b/i,
  /\btemple\b/i,
  /\bonly \d+ left\b/i,
  /\bselling fast\b/i,
  /\bcountdown\b/i,
  /\breviews?\b/i,
  /\btestimonials?\b/i,
  /\bwealth\b/i,
  /\bfortune\b/i,
  /\bmoney\b/i,
  /\blove\b/i,
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".ts") || full.endsWith(".tsx") ? [full] : [];
  });
}

describe("copy and client boundaries", () => {
  it("keeps outcome claims out of the catalog and draft copy", () => {
    const blob = JSON.stringify({ products, collections, contentPages, homeCopy, trustBadges }).replaceAll(
      EXACT_DISCLAIMER,
      "",
    );
    for (const pattern of banned) {
      expect(blob.match(pattern)).toBeNull();
    }
  });

  it("does not import server secrets into client components", () => {
    const files = [...walk("components"), ...walk("app")];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      if (!text.includes("use client")) continue;
      expect(text, file).not.toMatch(/PAYPAL_CLIENT_SECRET|server-config|paypal\/client/);
    }
  });
});
