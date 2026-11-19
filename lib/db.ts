import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { products } from "@/lib/catalog";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS inventory (
  product_id TEXT PRIMARY KEY,
  quantity INTEGER NOT NULL CHECK (quantity >= 0)
);

CREATE TABLE IF NOT EXISTS carts (
  id TEXT PRIMARY KEY,
  version INTEGER NOT NULL,
  items_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  cart_id TEXT,
  cart_version INTEGER NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  currency TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  mode TEXT NOT NULL,
  paypal_order_id TEXT,
  create_request_id TEXT,
  capture_request_id TEXT,
  items_json TEXT NOT NULL,
  inventory_decremented INTEGER NOT NULL DEFAULT 0,
  paid_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (cart_id, cart_version, kind)
);

CREATE TABLE IF NOT EXISTS captures (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  paypal_order_id TEXT,
  status TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  raw_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  verified INTEGER NOT NULL,
  outcome TEXT NOT NULL,
  order_id TEXT,
  payload_json TEXT NOT NULL,
  processed_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_paypal ON orders(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_captures_order ON captures(order_id);
`;

export type AppDatabase = DatabaseSync;

export function resolveDatabasePath(raw: string | undefined): string {
  const trimmed = raw?.trim();
  if (!trimmed || trimmed === ":memory:") {
    return path.join(process.cwd(), "data", "store.sqlite");
  }
  return trimmed;
}

export function openDatabase(filePath: string): AppDatabase {
  const db = new DatabaseSync(filePath);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");
  ensureSchema(db);
  return db;
}

export function ensureSchema(db: AppDatabase): void {
  db.exec(SCHEMA);
  const existing = db.prepare("SELECT version FROM schema_migrations WHERE version = 1").get();
  if (!existing) {
    db.prepare("INSERT INTO schema_migrations (version) VALUES (1)").run();
  }
}

export function seedInventory(
  db: AppDatabase,
  rows: { productId: string; quantity: number }[],
): void {
  const insert = db.prepare(
    "INSERT INTO inventory (product_id, quantity) VALUES (?, ?) ON CONFLICT(product_id) DO NOTHING",
  );
  for (const row of rows) {
    insert.run(row.productId, row.quantity);
  }
}

export function seedCatalogInventory(db: AppDatabase): void {
  seedInventory(
    db,
    products.map((product) => ({
      productId: product.id,
      quantity: product.illustrativeQuantity,
    })),
  );
}

let cached: { path: string; db: AppDatabase } | null = null;

export function getDb(): AppDatabase {
  const filePath = resolveDatabasePath(process.env.DATABASE_PATH);
  if (cached && cached.path === filePath) return cached.db;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const db = openDatabase(filePath);
  seedCatalogInventory(db);
  cached = { path: filePath, db };
  return db;
}

export function resetDbCacheForTests(): void {
  if (cached) {
    cached.db.close();
    cached = null;
  }
}

export function withImmediateTransaction<T>(db: AppDatabase, fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      /* already rolled back */
    }
    throw error;
  }
}
