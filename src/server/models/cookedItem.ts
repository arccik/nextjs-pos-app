import { and, count, eq, gte, sql } from "drizzle-orm";

import { db } from "../db";
import { type NewCookedItem, cookedItems, items } from "../db/schemas";
import { startOfDay } from "date-fns";

export const getOne = async (id: string) => {
  return await db.query.cookedItems.findFirst({
    where: eq(cookedItems.id, id),
  });
};
export const getAll = async (orderId?: string) => {
  if (orderId) {
    return await db.query.cookedItems.findMany({
      where: eq(cookedItems.orderId, orderId),
    });
  } else {
    return await db.query.cookedItems.findMany();
  }
};
export const update = async (id: string, body: Partial<NewCookedItem>) => {
  return await db
    .update(cookedItems)
    .set(body)
    .where(eq(cookedItems.id, id))
    .returning();
};

export const create = async (body: NewCookedItem) => {
  return await db.insert(cookedItems).values(body).returning();
};

export const deleteOne = async ({
  itemId,
  orderId,
}: {
  itemId: string;
  orderId: string;
}) => {
  const result = await db
    .delete(cookedItems)
    .where(
      and(eq(cookedItems.itemId, itemId), eq(cookedItems.orderId, orderId)),
    );
  return result;
};

export const getTodayTotal = async () => {
  const today = new Date();
  const result = await db
    .select({ count: count() })
    .from(cookedItems)
    .where(gte(cookedItems.createdAt, startOfDay(today)));
  return result[0]?.count;
};

export const getMostPopular = async () => {
  const cookedItemsList = await db.query.cookedItems.findMany();
  const ids = cookedItemsList.map((item) => item.itemId);
  const result = await db
    .select({
      itemId: cookedItems.itemId,
      itemName: items.name, // Assuming you have a `name` column in the `items` table
      frequency: sql<number>`SUM(${cookedItems.quantity})`,
    })
    .from(cookedItems)
    .innerJoin(items, sql`${cookedItems.itemId} = ${items.id}`)
    .where(sql`${cookedItems.itemId} IN (${sql.join(ids)})`)
    .groupBy(cookedItems.itemId)
    .orderBy(sql`SUM(${cookedItems.quantity}) DESC`);

  return result;
};

export const getLeastPopular = async () => {
  const cookedItemsList = await db.query.cookedItems.findMany();
  const ids = cookedItemsList.map((item) => item.itemId);
  const result = await db
    .select({
      itemId: cookedItems.itemId,
      itemName: items.name, // Assuming you have a `name` column in the `items` table
      frequency: sql<number>`SUM(${cookedItems.quantity})`,
    })
    .from(cookedItems)
    .innerJoin(items, sql`${cookedItems.itemId} = ${items.id}`)
    .where(sql`${cookedItems.itemId} IN (${sql.join(ids)})`)
    .groupBy(cookedItems.itemId)
    .orderBy(sql`SUM(${cookedItems.quantity}) ASC`);

  return result;
};

export const getPopularItem = async () => {
  return await db.select().from(cookedItems).groupBy(cookedItems.itemId);
};