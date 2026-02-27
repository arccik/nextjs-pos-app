import { db, type LocalOrder, type LocalOrderItem } from "./localDb";

export async function seedLocalCache(utils: {
  item: { getAll: { fetch: () => Promise<unknown[]> } };
  category: { getAll: { fetch: () => Promise<unknown[]> } };
  table: { getAll: { fetch: (input?: unknown) => Promise<unknown[]> } };
}): Promise<void> {
  try {
    const [items, categories, tables] = await Promise.all([
      utils.item.getAll.fetch(),
      utils.category.getAll.fetch(),
      utils.table.getAll.fetch(undefined),
    ]);
    await db.transaction(
      "rw",
      [db.items, db.categories, db.restaurantTables],
      async () => {
        await db.items.bulkPut(items as Parameters<typeof db.items.bulkPut>[0]);
        await db.categories.bulkPut(
          categories as Parameters<typeof db.categories.bulkPut>[0],
        );
        await db.restaurantTables.bulkPut(
          tables as Parameters<typeof db.restaurantTables.bulkPut>[0],
        );
      },
    );
  } catch {
    // Silently fail — offline seeding is best-effort
  }
}

export async function seedTodayOrders(utils: {
  order: {
    getAllByToday: {
      fetch: (input?: unknown) => Promise<
        Array<{
          id: string;
          userId: string;
          selectedBy: string | null;
          tableId: string | null;
          isPaid: boolean;
          status: "Pending" | "Ready" | "In Progress" | "Completed" | "Cancelled" | "Served";
          guestLeft: boolean;
          specialRequest: string | null;
          billId: string | null;
          createdAt: Date;
          updatedAt: Date;
          orderItems?: Array<{
            orderId?: string;
            itemId: string;
            quantity: number;
            createdAt: Date;
            updatedAt: Date;
          }>;
        }>
      >;
    };
  };
}): Promise<void> {
  try {
    const orders = await utils.order.getAllByToday.fetch(undefined);
    const localOrders: LocalOrder[] = orders.map((o) => ({
      id: o.id,
      userId: o.userId,
      selectedBy: o.selectedBy,
      tableId: o.tableId,
      isPaid: o.isPaid,
      status: o.status,
      guestLeft: o.guestLeft,
      specialRequest: o.specialRequest,
      billId: o.billId,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    }));

    const localOrderItems: LocalOrderItem[] = orders.flatMap((o) =>
      (o.orderItems ?? [])
        .filter((oi) => oi.orderId !== undefined)
        .map((oi) => ({
          orderId: oi.orderId ?? o.id,
          itemId: oi.itemId,
          quantity: oi.quantity,
          createdAt: oi.createdAt,
          updatedAt: oi.updatedAt,
        })),
    );

    await db.transaction("rw", [db.orders, db.orderItems], async () => {
      await db.orders.bulkPut(localOrders);
      if (localOrderItems.length > 0) {
        await db.orderItems.bulkPut(localOrderItems);
      }
    });
  } catch {
    // Silently fail
  }
}
