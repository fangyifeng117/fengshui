import { parentPort, workerData } from "node:worker_threads";
import { applyVerifiedCapture } from "../../lib/commerce/fulfill";
import { openDatabase } from "../../lib/db";

const db = openDatabase(workerData.databasePath as string);
try {
  const result = applyVerifiedCapture(db, workerData.command);
  db.close();
  parentPort?.postMessage({ ok: true, result });
} catch (error) {
  try {
    db.close();
  } catch {
    /* already closed */
  }
  parentPort?.postMessage({
    ok: false,
    message: error instanceof Error ? error.message : "worker_failed",
  });
}
