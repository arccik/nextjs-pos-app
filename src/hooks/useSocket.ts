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

    if (!isOnline) {
      socket.disconnect();
      return;
    }

    const handleConnect = () => {
      // Rejoin the room on every connect/reconnect
      socket.emit("join:restaurant");

      const clientProxy = utils.client as unknown as ClientLike;
      const dispatch = (path: string, input: unknown): Promise<unknown> => {
        const [routerName, procedureName] = path.split(".") as [
          string,
          string,
        ];
        const proc = clientProxy[routerName]?.[procedureName];
        if (!proc)
          return Promise.reject(new Error(`Unknown tRPC path: ${path}`));
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
    };

    const handleOrderUpdated = () => void utils.order.invalidate();
    const handleTableUpdated = () => void utils.table.invalidate();
    const handlePaymentCreated = () => {
      void utils.bill.invalidate();
      void utils.payment.invalidate();
    };

    socket.on("connect", handleConnect);
    socket.on("order:updated", handleOrderUpdated);
    socket.on("table:updated", handleTableUpdated);
    socket.on("payment:created", handlePaymentCreated);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("order:updated", handleOrderUpdated);
      socket.off("table:updated", handleTableUpdated);
      socket.off("payment:created", handlePaymentCreated);
    };
  }, [isOnline, utils]);
}
