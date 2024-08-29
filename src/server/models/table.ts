"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import {
  type NewTable,
  orders,
  reservations,
  type Table,
  tables,
  type TableStatus,
} from "../db/schemas";

export const getOne = async (id: string) => {
  return await db.query.tables.findFirst({ where: eq(tables.id, id) });
};

export const getAllByStatus = async (status: TableStatus) => {
  return await db.query.tables.findMany({
    where: eq(tables.status, status),
    with: {
      user: true,
      reservations: true,
    },
  });
};

export const getAll = async (status: TableStatus | undefined) => {
  const result = await db.query.tables.findMany({
    where: status ? eq(tables.status, status) : undefined,
    with: {
      reservations: {
        where: and(
          eq(reservations.tableId, tables.id),
          // eq(reservations.scheduledAt, date),
        ),
      },
    },
  });
  return result;
};

export const create = async (body: NewTable) => {
  const isExist = await db.query.tables.findFirst({
    where: eq(tables.number, body.number),
  });
  if (isExist) return { error: "Table number already exist" };
  return await db.insert(tables).values(body).returning();
};

//delete a tables
export const deleteOne = async (id: string) => {
  return await db.delete(tables).where(eq(tables.id, id));
};
//update a tables record
export const update = async (id: string, body: Table) => {
  return await db.update(tables).set(body).where(eq(tables.id, id)).returning();
};
export const updateStatus = async (id: string, status: TableStatus) => {
  return await db
    .update(tables)
    .set({ status })
    .where(eq(tables.id, id))
    .returning();
};

export const markClean = async (id: string) => {
  console.log("MARK AS CLEAN >>>> ", id);

  return await db
    .update(tables)
    .set({ requireCleaning: false })
    .where(eq(tables.id, id))
    .returning();
};

export const setSelectedTable = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  const isExist = await getSelectedTable(userId);
  if (isExist) {
    await unselectTable(userId);
  }
  const result = await db
    .update(tables)
    .set({ selectedBy: userId })
    .where(eq(tables.id, id));
  return result;
};

export const unsetSelectedTable = async ({ id }: { id: string }) => {
  return await db
    .update(tables)
    .set({ selectedBy: null })
    .where(eq(tables.id, id));
};

export const getSelectedTable = async (userId: string) => {
  const result = await db.query.tables.findFirst({
    where: eq(tables.selectedBy, userId),
  });
  return result ?? "null";
};

export const unselectTable = async (userId: string) => {
  return await db
    .update(tables)
    .set({ selectedBy: null })
    .where(eq(tables.selectedBy, userId))
    .returning();
};

export const guestLeave = async (orderId: string) => {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });
  console.log("GUEST LEAVE AAAA A A AA A", { orderId, order });
  if (!order) return null;
  if (order.tableId) {
    await db
      .update(tables)
      .set({ selectedBy: null, requireCleaning: true, status: "available" })
      .where(eq(tables.id, order.tableId));
  }
};