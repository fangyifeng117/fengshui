import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3000";
const outDir = process.env.SCREENSHOT_DIR ?? "/opt/cursor/artifacts";
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const pages = [
  ["home-en", "/"],
  ["home-zh", "/zh"],
  ["product-en", "/products/sample-red-cord-bracelet"],
  ["temples-en", "/temples"],
  ["temples-zh", "/zh/temples"],
  ["blessing-en", "/blessing"],
];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/local/bin/google-chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
await mkdir(outDir, { recursive: true });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  for (const [name, route] of pages) {
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    if (name === "product-en") {
      const modules = await page.locator("[data-module]").evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-module")),
      );
      const expected = ["breadcrumb", "gallery", "purchase", "benefits", "trust", "specs", "use", "disclaimer", "faq", "related"];
      if (modules.join(",") !== expected.join(",")) throw new Error(`module order ${modules.join(",")}`);
      const blank = await page.locator("[data-module=related] img").evaluateAll((imgs) =>
        imgs.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.alt),
      );
      if (blank.length) throw new Error(`blank related images: ${blank.join(", ")}`);
      if (viewport.name === "desktop") {
        const title = await page.getByRole("heading", { level: 1 }).boundingBox();
        const price = await page.locator(".price-large").boundingBox();
        const add = await page.getByRole("button", { name: "Add to cart" }).boundingBox();
        for (const [label, box] of [["title", title], ["price", price], ["add", add]]) {
          if (!box || box.y > 900) throw new Error(`${label} is outside the first desktop screen`);
        }
      }
    }
    if (name === "temples-en") {
      for (const mountain of ["Wutai Mountain", "Emei Mountain", "Putuo Mountain", "Jiuhua Mountain", "Xuedou Mountain"]) {
        await page.getByRole("heading", { name: mountain }).waitFor();
      }
    }
    if (name === "blessing-en") {
      await page.getByText("Coming soon").first().waitFor();
      if (await page.locator("form").count()) throw new Error("blessing page has a form");
    }
    await page.screenshot({ path: path.join(outDir, `m1-${name}-${viewport.name}.png`), fullPage: true });
  }

  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "中文" }).click();
  await page.waitForURL("**/zh");
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await page.waitForURL((url) => url.pathname === "/");
  await context.close();
}

await browser.close();
console.log(`wrote m1 screenshots to ${outDir}`);
