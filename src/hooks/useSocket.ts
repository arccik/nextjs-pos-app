"use client";

import { useEffect } from "react";
import { useOnlineStatus } from "@/lib/onlineStatus";
import { getSocket } from "@/lib/socketClient";
import { replayQueue } from "@/lib/syncQueue";
import { seedLocalCache, seedTodayOrders } from "@/lib/db/cache";
import { api } from "@/trpc/react";

// Minimal shape for dynamic procedure dispatch
type ProcedureLike = { mutate: (input: unknown) => Promise<unknown> };
type ClientLike = Record<string, Record<string, ProcedureLike>>;

export function useSocket() {
  const isOnline = useOnlineStatus();
  const utils = api.useUtils();

  useEffect(() => {
    const socket = getSocket();

    if (isOnline) {
      socket.connect();
      socket.emit("join:restaurant");

      socket.on("order:updated", () => {
        void utils.order.invalidate();
      });
      socket.on("table:updated", () => {
        void utils.table.invalidate();
      });
      socket.on("payment:created", () => {
        void utils.bill.invalidate();
        void utils.payment.invalidate();
      });

      socket.on("connect", () => {
        // Dispatch mutations via tRPC client using dynamic path
        const clientProxy = utils.client as unknown as ClientLike;
        const dispatch = (path: string, input: unknown): Promise<unknown> => {
          const [routerName, procedureName] = path.split(".") as [string, string];
          const proc = clientProxy[routerName]?.[procedureName];
          if (!proc) return Promise.reject(new Error(`Unknown tRPC path: ${path}`));
          return proc.mutate(input);
        };

        void replayQueue(dispatch)
          .then(() =>
            seedLocalCache(
              utils as unknown as Parameters<typeof seedLocalCache>[0],
            ),
          )
          .then(() =>
            seedTodayOrders(
              utils as unknown as Parameters<typeof seedTodayOrders>[0],
            ),
          )
          .then(() => utils.invalidate());
      });
    } else {
      socket.disconnect();
    }

    return () => {
      socket.off("order:updated");
      socket.off("table:updated");
      socket.off("payment:created");
      socket.off("connect");
    };
  }, [isOnline, utils]);
}
