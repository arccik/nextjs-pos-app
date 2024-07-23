"use server";
import { and, eq } from "drizzle-orm";
import { db } from "../db";
import {
  NewTable,
  reservations,
  Table,
  tables,
  TableStatus,
  TableWithReservation,
} from "../db/schemas";

export const getOne = async (id: string) => {
  return await db.query.tables.findFirst({ where: eq(tables.id, id) });
};

export const getAllByStatus = async (status: TableStatus) => {
  return await db.query.tables.findMany({
    where: eq(tables.status, status),
    with: {
      reservations: {
        where: eq(reservations.tableId, tables.id),
      },
    },
  });
};

export const getAll = async () => {
  const date = new Date().toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const result = await db.query.tables.findMany({
    with: {
      reservations: {
        where: and(
          eq(reservations.tableId, tables.id),
          eq(reservations.scheduledAt, date),
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
  console.log("SET SELECTED TABLE >>>> ", { id, userId });
  const result = await db
    .update(tables)
    .set({ selectedBy: userId })
    .where(eq(tables.id, id));
  console.log("RESULT", result);
  return result;
};

export const unsetSelectedTable = async ({
  id,
  userId,
}: {
  id: string;
  userId?: string;
}) => {
  return await db
    .update(tables)
    .set({ selectedBy: null })
    .where(eq(tables.id, id))
    .returning();
};

export const getSelectedTable = async (userId: string) => {
  const result = await db.query.tables.findFirst({
    where: eq(tables.selectedBy, userId),
  });
  console.log("getSe lectedT ableget ", result);
  // const [result] = await db
  //   .select()
  //   .from(tables)
  //   .where(eq(tables.selectedBy, userId));
  return result !== undefined ? result : null;
};

export const unselectTable = async (tableId: string) => {
  return await db
    .update(tables)
    .set({ selectedBy: null })
    .where(eq(tables.id, tableId))
    .returning();
};
