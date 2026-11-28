import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.env.SCREENSHOT_BASE_URL ?? "http://127.0.0.1:3000";
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

  await page.goto(`${base}/zh`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "五台山" }).waitFor();
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "购物车" }).waitFor();
  await page.getByText("图片是真实库存吗？").waitFor();
  if (await page.getByText("图片是真实地方吗？").count()) throw new Error("old FAQ wording is still visible");
  await page.screenshot({ path: path.join(outDir, `m1b-home-zh-${viewport.name}.png`), fullPage: true });

  await page.getByRole("link", { name: "EN", exact: true }).click();
  await page.waitForURL((url) => url.pathname === "/");
  await page.getByRole("link", { name: "Wutai Mountain" }).waitFor();
  await page.screenshot({ path: path.join(outDir, `m1b-home-en-${viewport.name}.png`), fullPage: true });

  await page.goto(`${base}/zh/products/sample-red-cord-bracelet`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: "样品红绳手串" }).waitFor();
  const modules = await page.locator("[data-module]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-module")));
  const expected = ["breadcrumb", "gallery", "purchase", "benefits", "trust", "specs", "use", "disclaimer", "faq", "related"];
  if (modules.join(",") !== expected.join(",")) throw new Error(`module order ${modules.join(",")}`);
  await page.getByText("免责声明：本网站的产品和内容仅供装饰").waitFor();
  await page.screenshot({ path: path.join(outDir, `m1b-product-zh-${viewport.name}.png`), fullPage: true });

  await page.goto(`${base}/zh/blessing`, { waitUntil: "networkidle" });
  await page.getByText("不能购买").waitFor();
  await page.getByText("尚未开售").waitFor();
  await page.getByText("Sold as a cultural craft").waitFor();
  if (await page.locator("form").count()) throw new Error("blessing page has a form");
  await page.screenshot({ path: path.join(outDir, `m1b-blessing-zh-${viewport.name}.png`), fullPage: true });

  await page.goto(`${base}/zh/products/sample-red-cord-bracelet`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "加入购物车" }).click();
  await page.waitForURL("**/zh/cart");
  await page.getByRole("link", { name: "查看演示结账" }).waitFor();
  await page.getByRole("button", { name: "移除 样品红绳手串" }).waitFor();
  await page.screenshot({ path: path.join(outDir, `m1b-cart-zh-${viewport.name}.png`), fullPage: true });

  await context.close();
}

await browser.close();
console.log(`wrote m1b screenshots to ${outDir}`);
