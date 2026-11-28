import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { Worker } from "node:worker_threads";
import esbuild from "esbuild";
import { describe, expect, it } from "vitest";
import { insertStoredOrder, readInventory } from "@/lib/commerce/orders";
import { openDatabase } from "@/lib/db";
import { seedSellable, sellable, tempDb } from "./helpers";

describe("concurrent capture events", () => {
  it("decrements inventory once when two workers deliver the same event", async () => {
    const fixture = tempDb();
    seedSellable(fixture.db);
    const order = insertStoredOrder(fixture.db, {
      cartId: "cart-race",
      cartVersion: 1,
      kind: "paypal",
      status: "paypal_created",
      currency: "USD",
      amountCents: 5000,
      mode: "sandbox",
      paypalOrderId: "PAY-1",
      items: [
        {
          productId: sellable.id,
          slug: sellable.slug,
          title: sellable.title,
          quantity: 1,
          unitAmountCents: 5000,
          currency: "USD",
          sample: false,
          captureAllowed: true,
        },
      ],
    });
    const databasePath = path.join(fixture.dir, "store.sqlite");
    fixture.db.close();
    const outfile = path.join(fixture.dir, "worker.cjs");
    await esbuild.build({
      entryPoints: [path.join(process.cwd(), "tests/workers/apply-capture.ts")],
      bundle: true,
      platform: "node",
      format: "cjs",
      outfile,
      external: ["node:sqlite", "node:fs", "node:path", "node:worker_threads"],
      plugins: [
        {
          name: "at-alias",
          setup(build) {
            build.onResolve({ filter: /^@\// }, (args) => {
              const base = path.join(process.cwd(), args.path.slice(2));
              const file = [base, `${base}.ts`, `${base}.tsx`].find((candidate) => existsSync(candidate));
              return { path: file ?? base };
            });
          },
        },
      ],
    });
    const command = {
      verified: true,
      eventId: "evt-race",
      eventType: "PAYMENT.CAPTURE.COMPLETED",
      orderId: order.id,
      paypalOrderId: "PAY-1",
      captureId: "CAP-RACE",
      captureStatus: "COMPLETED",
      amountCents: 5000,
      currency: "USD",
      payload: { id: "evt-race" },
    };
    const run = () =>
      new Promise<{ ok: boolean; result?: { fulfilled: boolean; reason: string }; message?: string }>(
        (resolve, reject) => {
          const worker = new Worker(outfile, { workerData: { databasePath, command } });
          let message: { ok: boolean; result?: { fulfilled: boolean; reason: string }; message?: string } | undefined;
          worker.once("message", (value) => {
            message = value;
          });
          worker.once("error", reject);
          worker.once("exit", (code) => {
            if (!message) {
              reject(new Error(`worker exited ${code} without a result`));
              return;
            }
            resolve(message);
          });
        },
      );
    const results = await Promise.all([run(), run()]);
    expect(results.every((result) => result.ok)).toBe(true);
    const fulfilled = results.filter((result) => result.result?.fulfilled).length;
    expect(fulfilled).toBe(1);
    const db = openDatabase(databasePath);
    expect(readInventory(db, sellable.id)).toBe(4);
    const events = db.prepare("SELECT COUNT(*) AS count FROM webhook_events").get() as { count: number };
    expect(Number(events.count)).toBe(1);
    db.close();
    rmSync(fixture.dir, { recursive: true, force: true });
  });
});
