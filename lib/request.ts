import { cookies } from "next/headers";
import { parseCartLines, type ServerCart } from "@/lib/cart";
import { publicConfig } from "@/lib/public-config";

const LINES_COOKIE = "cjd_lines";

export function isCrossSite(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    return true;
  }
  const allowed = new Set<string>(["localhost:3000", "127.0.0.1:3000"]);
  const host = request.headers.get("host");
  if (host) allowed.add(host);
  try {
    allowed.add(new URL(publicConfig.baseUrl).host);
  } catch {
    /* base URL already normalized */
  }
  return !allowed.has(originHost);
}

export async function existingCartId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get("cjd_cart")?.value ?? null;
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  };
}

export async function readCartDocument(): Promise<ServerCart> {
  const jar = await cookies();
  const id = jar.get("cjd_cart")?.value ?? "cart_cookie";
  return { id, version: 0, lines: parseCartLines(jar.get(LINES_COOKIE)?.value) };
}

export async function writeCartDocument(cart: ServerCart): Promise<void> {
  const jar = await cookies();
  const options = cookieOptions();
  const currentId = jar.get("cjd_cart")?.value;
  const id = currentId && currentId !== "cart_cookie" ? currentId : cart.id;
  jar.set("cjd_cart", id, options);
  jar.set(LINES_COOKIE, JSON.stringify(cart.lines), options);
}

export async function ensureCartId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get("cjd_cart")?.value;
  if (existing) return existing;
  const id = `cart_${crypto.randomUUID()}`;
  jar.set("cjd_cart", id, cookieOptions());
  return id;
}
