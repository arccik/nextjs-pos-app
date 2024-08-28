import { eq } from "drizzle-orm";

import { db } from "../db";
import { type Category, type NewCategory, categories } from "../db/schemas";

export const getOne = async (id: number) => {
  return await db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
};
export const getAll = async () => {
  return await db.query.categories.findMany();
};
export const update = async (body: Category) => {
  return await db
    .update(categories)
    .set(body)
    .where(eq(categories.id, body.id))
    .returning();
};

export const create = async (body: NewCategory) => {
  return await db.insert(categories).values(body).returning();
};

export const deleteOne = async (id: number) => {
  const result = await db.delete(categories).where(eq(categories.id, id));
  return result;
};
