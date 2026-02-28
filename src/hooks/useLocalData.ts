"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useOnlineStatus } from "@/lib/onlineStatus";
import {
  db,
  type LocalOrder,
  type LocalRestaurantTable,
  type LocalItem,
  type LocalCategory,
} from "@/lib/db/localDb";
import { api } from "@/trpc/react";

type OrderStatus = "Pending" | "Ready" | "In Progress" | "Completed" | "Cancelled" | "Served";

export function useLocalOrders(status?: OrderStatus) {
  const isOnline = useOnlineStatus();
  const serverQuery = api.order.getAllByToday.useQuery(status, { enabled: isOnline });

  const localOrders = useLiveQuery<LocalOrder[]>(
    () => {
      if (isOnline) return Promise.resolve([]);
      if (status) {
        return db.orders.where("status").equals(status).toArray();
      }
      return db.orders.toArray();
    },
    [isOnline, status],
  );

  if (isOnline) return serverQuery.data ?? [];
  return localOrders ?? [];
}

export function useLocalTables(
  status?: "available" | "occupied" | "reserved" | "closed",
) {
  const isOnline = useOnlineStatus();
  const serverQuery = api.table.getAll.useQuery(status, { enabled: isOnline });

  const localTables = useLiveQuery<LocalRestaurantTable[]>(
    () => {
      if (isOnline) return Promise.resolve([]);
      if (status) {
        return db.restaurantTables.where("status").equals(status).toArray();
      }
      return db.restaurantTables.toArray();
    },
    [isOnline, status],
  );

  if (isOnline) return serverQuery.data ?? [];
  return localTables ?? [];
}

export function useLocalItems() {
  const isOnline = useOnlineStatus();
  const serverQuery = api.item.getAll.useQuery(undefined, { enabled: isOnline });

  const localItems = useLiveQuery<LocalItem[]>(
    () => {
      if (isOnline) return Promise.resolve([]);
      return db.items.toArray();
    },
    [isOnline],
  );

  if (isOnline) return serverQuery.data ?? [];
  return localItems ?? [];
}

export function useLocalCategories() {
  const isOnline = useOnlineStatus();
  const serverQuery = api.category.getAll.useQuery(undefined, { enabled: isOnline });

  const localCategories = useLiveQuery<LocalCategory[]>(
    () => {
      if (isOnline) return Promise.resolve([]);
      return db.categories.toArray();
    },
    [isOnline],
  );

  if (isOnline) return serverQuery.data ?? [];
  return localCategories ?? [];
}

export function useLocalSelectedTable(userId: string | undefined) {
  const isOnline = useOnlineStatus();
  const serverQuery = api.table.getSelectedTable.useQuery(undefined, { enabled: isOnline });

  const localTable = useLiveQuery<LocalRestaurantTable | undefined>(
    () => {
      if (isOnline || !userId) return Promise.resolve(undefined);
      return db.restaurantTables.filter((t) => t.selectedBy === userId).first();
    },
    [isOnline, userId],
  );

  if (isOnline) return serverQuery.data;
  return localTable ?? undefined;
}

// Hook to check pending sync count for UI indicator
export function usePendingSyncCount(): number {
  const [count, setCount] = useState(0);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (isOnline) {
      setCount(0);
      return;
    }
    const update = () => {
      void db.syncQueue.where("status").equals("pending").count().then(setCount);
    };
    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, [isOnline]);

  return count;
}
