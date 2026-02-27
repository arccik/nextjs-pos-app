import { db, type SyncQueueEntry } from "./db/localDb";

export type { SyncQueueEntry };

// Minimal interface for dispatching mutations via tRPC untyped client
export type MutationDispatcher = (path: string, input: unknown) => Promise<unknown>;

export async function enqueue(trpcPath: string, input: unknown): Promise<string> {
  const id = crypto.randomUUID();
  await db.syncQueue.add({
    id,
    trpcPath,
    input,
    createdAt: Date.now(),
    status: "pending",
    retryCount: 0,
  });

  // Register background sync if supported
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const reg = await navigator.serviceWorker.ready;
      const regWithSync = reg as ServiceWorkerRegistration & {
        sync: { register: (tag: string) => Promise<void> };
      };
      await regWithSync.sync.register("sync-mutations");
    } catch {
      // Background sync not available — will replay on next connect
    }
  }

  return id;
}

export async function replayQueue(dispatch: MutationDispatcher): Promise<void> {
  const pending = await db.syncQueue.where("status").equals("pending").sortBy("createdAt");

  for (const entry of pending) {
    await db.syncQueue.update(entry.id, { status: "processing" });
    try {
      await dispatch(entry.trpcPath, entry.input);
      await db.syncQueue.delete(entry.id);
    } catch {
      const nextRetry = entry.retryCount + 1;
      await db.syncQueue.update(entry.id, {
        status: nextRetry >= 3 ? "failed" : "pending",
        retryCount: nextRetry,
      });
    }
  }
}

export async function getPendingCount(): Promise<number> {
  return db.syncQueue.where("status").equals("pending").count();
}
