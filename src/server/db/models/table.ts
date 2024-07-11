"use server";
import { and, eq } from "drizzle-orm";
import { db } from "..";
import { NewTable, reservations, Table, tables, TableStatus } from "../schemas";
import { format } from "date-fns";

export const getOne = async (id: number) => {
  try {
    return await db.query.tables.findFirst({ where: eq(tables.id, id) });
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal [db] server error");
  }
};

export const getAllByStatus = async (status: TableStatus) => {
  try {
    return await db.query.tables.findMany({
      where: eq(tables.status, status),
      with: {
        reservations: {
          where: eq(reservations.tableId, tables.id),
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

export const getAll = async () => {
  const date = new Date().toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  try {
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
  } catch (error_1) {
    console.error(error_1);
    throw new Error("Internal server error");
  }
};

export const create = async (body: NewTable) => {
  try {
    const isExist = await db.query.tables.findFirst({
      where: eq(tables.number, body.number),
    });
    if (isExist) return { error: "Table number already exist" };
    return await db.insert(tables).values(body).returning();
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
    // return { error: "[db:createTable] Went wrong.." };
  }
};

//delete a tables
export const deleteOne = async (id: number) => {
  try {
    return await db.delete(tables).where(eq(tables.id, id));
  } catch (error) {
    console.log(error);
    return { error: "[db:deleteTable] Went wrong.." };
  }
};
//update a tables record
export const update = async (id: number, body: Table) => {
  try {
    return await db
      .update(tables)
      .set(body)
      .where(eq(tables.id, id))
      .returning();
  } catch (error) {
    console.error(error);
    return { error: "[db:updateTable] Went wrong.." };
  }
};
export const updateStatus = async (id: number, status: TableStatus) => {
  try {
    return await db
      .update(tables)
      .set({ status })
      .where(eq(tables.id, id))
      .returning();
  } catch (error) {
    console.error(error);
    return { error: "[db:updateStatus] Went wrong.." };
  }
};

export const markClean = async (id: number) => {
  try {
    console.log("MARK AS CLEAN >>>> ", id);

    return await db
      .update(tables)
      .set({ requireCleaning: false })
      .where(eq(tables.id, id))
      .returning();
  } catch (error) {
    console.error(error);
    return { error: "[db:markClean] Went wrong.." };
  }
};

export const setSelectedTable = (id: number, userId: number) => {
  try {
    return db
      .update(tables)
      .set({ selectedBy: userId })
      .where(eq(tables.id, id))
      .returning();
  } catch (error) {
    console.error(error);
    return { error: "[db:setSelectedTable] Went wrong.." };
  }
};

export const unsetSelectedTable = (id: number, userId?: number) => {
  try {
    return db
      .update(tables)
      .set({ selectedBy: null })
      .where(eq(tables.id, id))
      .returning();
  } catch (error) {
    console.error(error);
    return { error: "[db:unsetSelectedTable] Went wrong.." };
  }
};
