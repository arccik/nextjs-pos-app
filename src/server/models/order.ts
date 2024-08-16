import { and, eq, getTableColumns, gte, ne, lt, SQL } from "drizzle-orm";

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
  Order,
  bills,
} from "../db/schemas";
import { combineItems, combineOrderItems } from "../../lib/utils";
import { endOfToday, startOfToday } from "date-fns";
import { StringOrTemplateHeader } from "@tanstack/react-table";
import { generateBill, updateBill } from "./bill";
import {
  SQLiteSelect,
  SQLiteSelectQueryBuilder,
} from "drizzle-orm/sqlite-core";

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

export const getOneByBillId = async (billId: string) => {
  const result = await db.query.orders.findFirst({
    where: and(eq(orders.billId, billId)),
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
  const order = await db.query.orders.findFirst({
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
  return order ?? null;
};
export const getAllByStatus = async (status: OrderStatus[number]) => {
  return await db.query.orders.findMany({
    where: eq(orders.status, status),
    with: { user: true, bill: true, orderItems: { with: { items: true } } },
  });
};

export const getAll = async () => {
  // const options: Record<string, SQL<unknown>> = {};

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

export const newOrder = async (body: NewOrder) => {
  console.log("NEw ORDER ??? ", { body });
  const [order] = await db.insert(orders).values(body).returning();
  console.log("NEw END <<>>  ??? ", { order });

  if (!order?.id) throw new Error("Error: Order ID is missing");
  console.log(" ✓ New ORder Creted:>>>>> ", order);

  const [bill] = await db
    .insert(bills)
    .values({
      totalAmount: 0,
      orderId: order?.id ? order?.id : "Error: Order ID is missing",
      userId: body.userId,
    })
    .returning();
  console.log(" ✓ New Bill Creted:>>>>> ", bill);

  if (!bill?.id) throw new Error("Error: Bill ID is missing");
  const [res] = await db
    .update(orders)
    .set({ billId: bill.id })
    .where(eq(orders.id, order.id))
    .returning({ id: orders.id });
  console.log(" ✓ New ORder UPDATED:>>>>> ", res);

  return res;
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
  orderId?: string | null;
  itemId: string;
  quantity?: number;
}) => {
  // Find the existing order or create a new one
  const order = await findOrCreateOrder(data.userId, data.orderId);
  if (!order) throw new Error("Issue with the order");
  // Check if the item already exists in the order
  const existingItem = order.orderItems?.find(
    (item) => item.itemId === data.itemId,
  );

  if (existingItem) {
    // Update the quantity of the existing item
    existingItem.quantity += data.quantity ?? 1;
    await db
      .update(orderItems)
      .set(existingItem)
      .where(eq(orderItems.orderId, existingItem.orderId));
  } else {
    // Add a new item to the order
    await db.insert(orderItems).values({
      quantity: data.quantity,
      itemId: data.itemId,
      orderId: order.id,
    });
  }

  // Update the bill (assuming updateBill is a separate function)
  await updateBill({ orderId: order.id, userId: data.userId });

  // Return the updated order ID
  return { id: order.id };
};

async function findOrCreateOrder(
  userId: string,
  orderId?: string | null,
): Promise<OrderWithItems | { id: string } | undefined> {
  if (!orderId) {
    const [newOrder] = await db
      .insert(orders)
      .values({ status: "Pending", userId })
      .returning({ id: orders.id });
    return newOrder;
  } else {
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { orderItems: true },
    });
    if (!existingOrder) {
      throw new Error("Order not found");
    }
    return existingOrder;
  }
}

export const deleteOne = async (id: string) => {
  return await db.delete(orders).where(eq(orders.id, id));
};

export const removeItemFromOrder = async ({
  itemId,
  orderId,
}: {
  itemId: string;
  orderId: string;
}) => {
  return await db
    .delete(orderItems)
    .where(and(eq(orderItems.orderId, orderId), eq(orderItems.itemId, itemId)));
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

export const getOrderWithItems = async (id: string) => {
  // i need to return order with items: name, id, quantity, price
  const result = await db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      orderItems: {
        with: {
          items: {
            columns: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    },
  });
  // Extract quantity from orderItems and add it to items
  const orderWithItems = {
    ...result!,
    orderItems: result!.orderItems.map((orderItem) => ({
      ...orderItem.items,
      quantity: orderItem.quantity,
    })),
  };
  return orderWithItems;
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

export const addSpecialRequest = async ({
  request,
  orderId,
}: {
  request: string;
  orderId: string;
}) => {
  const result = await db
    .update(orders)
    .set({ specialRequest: request })
    .where(eq(orders.id, orderId));
  return result;
};
export const getSpecialRequest = async ({ orderId }: { orderId: string }) => {
  return await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    columns: { specialRequest: true },
  });
  // return await db
  //   .select({ specialRequest: orders.specialRequest })
  //   .from(orders)
  //   .where(eq(orders.id, orderId));
};

export const getPendingOrder = async (userId: string) => {
  return await db.query.orders.findFirst({
    where: and(eq(orders.userId, userId), eq(orders.status, "Pending")),
  });
};

export const updateOrder = async ({
  id,
  body,
}: {
  id: string;
  body: NewOrder;
}) => {
  return await db.update(orders).set(body).where(eq(orders.id, id));
};

export const setOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus[number];
}) => {
  const result = await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, orderId));
  return result;
};
