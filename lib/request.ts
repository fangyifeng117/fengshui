import { cookies } from "next/headers";
import { publicConfig } from "@/lib/public-config";

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

export async function ensureCartId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get("cjd_cart")?.value;
  if (existing) return existing;
  const id = `cart_${crypto.randomUUID()}`;
  jar.set("cjd_cart", id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  return id;
}
