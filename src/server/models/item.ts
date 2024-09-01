import { eq } from "drizzle-orm";

import { db } from "../db";
import { items, type NewItem } from "../db/schemas";

export const getOne = async (id: string) => {
  return await db.query.items.findFirst({
    where: eq(items.id, id),
  });
};
export const getAll = async () => {
  return await db.query.items.findMany();
};
export const getStopItems = async () => {
  return await db.query.items.findMany({
    where: eq(items.isAvailable, false),
  });
};
export const update = async (body: NewItem & { id: string }) => {
  return await db
    .update(items)
    .set(body)
    .where(eq(items.id, body.id))
    .returning();
};

export const create = async (body: NewItem) => {
  return await db.insert(items).values(body).returning();
};

export const deleteOne = async (id: string) => {
  const result = await db.delete(items).where(eq(items.id, id));
  return result;
};

export const addItemToStopList = async (id: string) => {
  return await db
    .update(items)
    .set({ isAvailable: false })
    .where(eq(items.id, id));
};

export const removeItemFromStopList = async (id: string) => {
  return await db
    .update(items)
    .set({ isAvailable: true })
    .where(eq(items.id, id));
};
