import { and, eq, getTableColumns, gte, ne, lt } from "drizzle-orm";

import { db } from "../db";
import {
  type NewOrder,
  orders,
  orderItems,
  OrderStatus,
  NewOrderWithItems,
  tables,
  NewOrderItem,
  items,
  users,
  Item,
  type NewItem,
} from "../db/schemas";
import { combineItems, combineOrderItems } from "../../lib/utils";
import { endOfToday, startOfToday } from "date-fns";
import { StringOrTemplateHeader } from "@tanstack/react-table";

export const getOne = async (id: string) => {
  const result = await db.query.orders.findFirst({
    where: and(eq(orders.id, id)),
    with: {
      orderItems: {
        columns: {
          orderId: false,
        },
        with: {
          items: {
            columns: {
              price: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
      bill: true,
    },
  });
  return result;
};

export const getOneByTableId = async (tableId: string) => {
  return await db.query.orders.findFirst({
    where: and(eq(orders.tableId, tableId), ne(orders.status, "Completed")),
    with: {
      orderItems: {
        columns: {
          orderId: false,
        },
        with: {
          items: {
            columns: {
              price: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
      user: true,
      bill: true,
    },
  });
};
export const getAll = async () => {
  return await db.query.orders.findMany({
    with: { user: true, bill: true, orderItems: { with: { items: true } } },
  });
};
type Unpromisify<T> = T extends Promise<infer U> ? U : T;
export type OrderWithItems = Unpromisify<
  ReturnType<typeof getOrdersWithItems>
>[0];

export const getOrdersWithItems = async (status?: OrderStatus[number]) => {
  const result = await db.query.orders.findMany({
    where: status ? eq(orders.status, status) : undefined,
    orderBy: (orders, { asc }) => [asc(orders.id)],
    with: {
      bill: true,
      orderItems: {
        columns: {
          orderId: false,
        },
        with: {
          items: {
            columns: {
              price: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });
  return result;
};

export const update = async (id: string, body: NewOrder) => {
  const result = await db.update(orders).set(body).where(eq(orders.id, id));
  return result;
};

export const create = async (values: NewOrderWithItems) => {
  const insertedOrder = await db
    .insert(orders)
    .values({ tableId: values.tableId, userId: values.userId })
    .returning();
  const orderId = insertedOrder[0]?.id;
  if (!orderId) throw new Error("Order ID is missing");
  await db
    .insert(orderItems)
    .values(values.items.map((item) => ({ ...item, orderId })));

  return {
    success: true,
    orderId,
    items: values.items,
    tableId: values.tableId,
  };
};

export const addItem = async (data: {
  userId: string;
  orderId?: string;
  id: string;
  quantity: number;
}) => {
  const selectedOrder = await db.query.orders.findFirst({
    where: eq(orders.status, "In Progress"),
  });
  if (!selectedOrder) throw new Error("Order not found");

  const [orderId] = await db
    .insert(orders)
    .values({ status: "Pending" })
    .returning();
  if (!orderId) throw new Error("Order ID is missing");
  const itemId = await db
    .insert(orderItems)
    .values({ quantity: data.quantity, itemId: data.id, orderId: orderId.id })
    .returning();
  return { orderId };
};

export const deleteOne = async (id: string) => {
  return await db.delete(orders).where(eq(orders.id, id));
};

export const pay = async (id: string) => {
  try {
    // TODO: do something ALL about this crap...
    return { id };
    // const orderId = await db.query.orders.findFirst({
    //   where: eq(orders.id, id),
    //   columns: { id: true },
    // });

    // if (!orderId) throw new Error("Order not found");

    // const totalAmoutPaid = await db.query.orderItems.findMany({
    //   where: eq(orderItems.orderId, id),
    //   with: {
    //     items: {
    //       columns: {
    //         price: true,
    //       },
    //     },
    //   },
    // });
    // const totalPrice = totalAmoutPaid?.reduce((cur, item) => cur + item.quantity * Number(item.items.price), 0);

    // await db.update(orders).set({ totalPrice: totalPrice.toString() }).where(eq(orders.id, id));

    // const result = await db.update(orders).set({ isPaid: true }).where(eq(orders.id, orderId.id));
    // return result;
  } catch (error) {
    console.log(error);
    return { error: "[db:payOrder] Went wrong.." };
  }
};

export const complete = async (id: string) => {
  const result = await db
    .update(orders)
    .set({ status: "Completed" })
    .where(eq(orders.id, id));
  db.update(tables)
    .set({ requireCleaning: true })
    .where(eq(tables.id, orders.tableId));
  return result;
};
export const cancelOrder = async (id: string) => {
  const result = await db
    .update(orders)
    .set({ status: "Cancelled" })
    .where(eq(orders.id, id));
  return result;
};

export const serve = async (id: string) => {
  const result = await db
    .update(orders)
    .set({ status: "Served" })
    .where(eq(orders.id, id));
  return result;
};

export const leave = async (id: string) => {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order?.tableId) return;
  const result = await db
    .update(tables)
    .set({ status: "available" })
    .where(eq(tables.id, order.tableId));
  return result;
};
export const reinstand = async (id: string) => {
  const result = await db
    .update(orders)
    .set({ status: "In Progress" })
    .where(eq(orders.id, id));
  return result;
};

export const recentCompletedOrders = async (tableId: string) => {
  return db.query.orders.findMany({
    where: and(eq(orders.tableId, tableId), eq(orders.status, "Completed")),
    with: {
      bill: true,
      user: { columns: { name: true, role: true, id: true } },
    },
  });
};

export const addSpecailRequest = async (id: string, request: string) => {
  const result = await db
    .update(orders)
    .set({ specialRequest: request })
    .where(eq(orders.id, id));
  return result;
};

export const addMoreItemsToOrder = async (moreItems: NewOrderItem[]) => {
  const orderId = moreItems[0]?.orderId;
  if (!orderId) throw new Error("Order ID is missing");

  const existingOrderItems = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const combinedOrderItems = combineOrderItems(existingOrderItems, moreItems);

  await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
  await db.insert(orderItems).values(combinedOrderItems);
  return { orderId };
};

export const getPending = async () => {
  const pendingOrders = await getOrdersWithItems("In Progress");
  return pendingOrders;
};

export const getOrderItems = async () => {
  const { password, ...rest } = getTableColumns(users);
  return await db
    .select({
      order_items: orderItems,
      orders: orders,
      items: items,
      users: rest,
      tables: tables,
    })
    .from(orderItems)
    .where(eq(orders.status, "In Progress"))
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .leftJoin(items, eq(orderItems.itemId, items.id))
    .leftJoin(users, eq(orders.userId, users.id))
    .leftJoin(tables, eq(orders.tableId, tables.id));
};

export const ready = async ({
  orderId,
}: {
  orderId: string;
  itemId: string;
}) => {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      orderItems: true,
    },
  });

  console.log("REady ? , ", order);
  const result = await db
    .update(orders)
    .set({ status: "Ready" })
    .where(eq(orders.id, orderId));
  return result;
};

export const getRecentOrders = async () => {
  return await db.query.orders.findMany({
    where: and(
      gte(orders.createdAt, startOfToday()),
      lt(orders.createdAt, endOfToday()),
    ),

    with: { user: { columns: { name: true, role: true } }, bill: true },
  });
};
