import { eq } from "drizzle-orm";

import { db } from "..";
import { items, NewItem, Item } from "../schemas";

export const getOne = async (id: number) => {
  try {
    return await db.query.items.findFirst({
      where: eq(items.id, id),
    });
  } catch (error) {
    console.log(error);
    return { error: "[db:getOneitem] Went wrong.." };
  }
};
export const getAll = async () => {
  try {
    return await db.query.items.findMany();
  } catch (error) {
    console.log(error);
    return { error: "[db:getManyitem] Went wrong.." };
  }
};
export const getStopItems = async () => {
  try {
    return await db.query.items.findMany({
      where: eq(items.isAvailable, false),
    });
  } catch (error) {
    console.log(error);
    return { error: "[db:getStopitems] Went wrong.." };
  }
};
export const update = async (id: number, body: Item) => {
  try {
    return await db.update(items).set(body).where(eq(items.id, id)).returning();
  } catch (error) {
    console.log(error);
    return { error: "[db:getManyitem] Went wrong.." };
  }
};

export const create = async (body: NewItem) => {
  try {
    return await db.insert(items).values(body).returning();
  } catch (error) {
    console.log(error);
    return { error: "[db:createitem] Went wrong.." };
  }
};

export const deleteOne = async (id: number) => {
  try {
    const result = await db.delete(items).where(eq(items.id, id));
    return result;
  } catch (error) {
    console.log(error);
    return { error: "[db:deleteitem] Went wrong.." };
  }
};

export const addItemToStopList = async (id: string) => {
  try {
    return await db
      .update(items)
      .set({ isAvailable: false })
      .where(eq(items.id, Number(id)));
  } catch (error) {
    console.log(error);
    return { error: "[db:additemstoplist] Went wrong.." };
  }
};

export const removeItemFromStopList = async (id: string) => {
  try {
    return await db
      .update(items)
      .set({ isAvailable: true })
      .where(eq(items.id, Number(id)));
  } catch (error) {
    console.log(error);
    return { error: "[db:removeitemstoplist] Went wrong.." };
  }
};
