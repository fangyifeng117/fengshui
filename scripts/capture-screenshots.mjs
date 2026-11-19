import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const outDir = process.env.SCREENSHOT_DIR ?? "/opt/cursor/artifacts";
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/local/bin/google-chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

await mkdir(outDir, { recursive: true });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, `review-home-${viewport.name}.png`), fullPage: true });

  await page.goto(`${base}/products/sample-red-cord-bracelet`, { waitUntil: "networkidle" });
  const modules = await page.locator("[data-module]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-module")));
  const expected = ["breadcrumb", "gallery", "purchase", "benefits", "trust", "specs", "use", "disclaimer", "faq", "related"];
  if (modules.join(",") !== expected.join(",")) {
    throw new Error(`module order ${modules.join(",")}`);
  }
  await page.screenshot({ path: path.join(outDir, `review-product-${viewport.name}.png`), fullPage: true });

  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.waitForURL("**/cart");
  async function changeQty(name, expected) {
    const response = page.waitForResponse((item) => item.url().includes("/api/cart") && item.request().method() === "PATCH");
    await page.getByRole("button", { name }).click();
    const result = await response;
    if (!result.ok()) throw new Error(`${name} failed`);
    await page.waitForLoadState("networkidle");
    await page.getByText(expected, { exact: true }).first().waitFor();
  }
  await changeQty("Increase quantity", "2");
  await changeQty("Decrease quantity", "1");
  await page.screenshot({ path: path.join(outDir, `review-cart-${viewport.name}.png`), fullPage: true });

  await page.getByRole("link", { name: "Continue to checkout" }).click();
  await page.waitForURL("**/checkout");
  const disabled = page.getByRole("button", { name: "Payment is off" });
  await disabled.waitFor();
  if (await disabled.isEnabled()) {
    throw new Error("Payment control was enabled");
  }
  if (!(await page.getByText("Test preview. Payment is off.").count())) {
    throw new Error("Checkout did not say payment is off");
  }
  await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
  const removed = page.waitForResponse((item) => item.url().includes("/api/cart") && item.request().method() === "PATCH");
  await page.getByRole("button", { name: "Remove Sample Red Cord Bracelet" }).click();
  if (!(await removed).ok()) throw new Error("Remove failed");
  await page.waitForLoadState("networkidle");
  await page.getByText("The cart is empty.").waitFor();
  await context.close();
}

await browser.close();
console.log(`wrote screenshots to ${outDir}`);
