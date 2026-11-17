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
  await page.screenshot({ path: path.join(outDir, `home-${viewport.name}.png`), fullPage: true });

  await page.goto(`${base}/products`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, `catalog-${viewport.name}.png`), fullPage: true });

  await page.goto(`${base}/products/sample-red-cord-bracelet`, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, `detail-${viewport.name}.png`), fullPage: true });

  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.waitForURL("**/cart");
  await page.screenshot({ path: path.join(outDir, `cart-${viewport.name}.png`), fullPage: true });

  await page.getByRole("link", { name: "Continue to checkout" }).click();
  await page.waitForURL("**/checkout");
  const disabled = page.getByRole("button", { name: "Sandbox not connected" });
  await disabled.waitFor();
  if (await disabled.isEnabled()) {
    throw new Error("Sandbox checkout button was enabled");
  }
  await page.screenshot({ path: path.join(outDir, `checkout-${viewport.name}.png`), fullPage: true });
  await context.close();
}

await browser.close();
console.log(`wrote screenshots to ${outDir}`);
