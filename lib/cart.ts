import type { AppDatabase } from "@/lib/db";
import { quoteLines } from "@/lib/commerce/quote";
import type { CartLine, Product } from "@/lib/types";

export type ServerCart = {
  id: string;
  version: number;
  lines: CartLine[];
};

function empty(id: string): ServerCart {
  return { id, version: 0, lines: [] };
}

export function readCart(db: AppDatabase, cartId: string): ServerCart {
  const row = db.prepare("SELECT id, version, items_json FROM carts WHERE id = ?").get(cartId) as
    | { id: string; version: number; items_json: string }
    | undefined;
  if (!row) return empty(cartId);
  const lines = JSON.parse(row.items_json) as CartLine[];
  return { id: row.id, version: row.version, lines };
}

function writeCart(db: AppDatabase, cart: ServerCart): ServerCart {
  const nextVersion = cart.version + 1;
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO carts (id, version, items_json, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET version = excluded.version, items_json = excluded.items_json, updated_at = excluded.updated_at`,
  ).run(cart.id, nextVersion, JSON.stringify(cart.lines), now);
  return { ...cart, version: nextVersion };
}

export function addToCart(
  db: AppDatabase,
  cartId: string,
  productId: string,
  quantity: number,
  catalog: Product[],
): ServerCart {
  if (!catalog.some((product) => product.id === productId)) {
    throw new Error("unknown_product");
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9) {
    throw new Error("invalid_quantity");
  }
  const cart = readCart(db, cartId);
  const lines = cart.lines.map((line) => ({ ...line }));
  const existing = lines.find((line) => line.productId === productId);
  if (existing) {
    existing.quantity = Math.min(9, existing.quantity + quantity);
  } else {
    lines.push({ productId, quantity });
  }
  return writeCart(db, { ...cart, lines });
}

export function setCartQuantity(
  db: AppDatabase,
  cartId: string,
  productId: string,
  quantity: number,
): ServerCart {
  const cart = readCart(db, cartId);
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 9) {
    throw new Error("invalid_quantity");
  }
  const current = cart.lines.find((line) => line.productId === productId);
  if (!current) return cart;
  if (current.quantity === quantity || (quantity === 0 && !current)) return cart;
  const lines =
    quantity === 0
      ? cart.lines.filter((line) => line.productId !== productId)
      : cart.lines.map((line) => (line.productId === productId ? { ...line, quantity } : line));
  if (current.quantity === quantity) return cart;
  return writeCart(db, { ...cart, lines });
}

export function quoteCart(catalog: Product[], cart: ServerCart) {
  if (cart.lines.length === 0) {
    return { items: [], amountCents: 0, currency: "USD" as const, demoBlocked: false };
  }
  return quoteLines(catalog, cart.lines);
}
