import { and, eq } from "drizzle-orm";

import { db } from "../db";
import { NewCookedItem, cookedItems } from "../db/schemas";

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
