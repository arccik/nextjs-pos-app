import { eq } from "drizzle-orm";

import { db } from "../db";
import { type NewIngredient, ingredients } from "../db/schemas";

export const getOne = async (id: number) => {
  return await db.query.ingredients.findFirst({
    where: eq(ingredients.id, id),
  });
};
export const getAll = async () => {
  return await db.query.ingredients.findMany();
};
export const update = async (id: number, body: NewIngredient) => {
  return await db
    .update(ingredients)
    .set(body)
    .where(eq(ingredients.id, id))
    .returning();
};

export const create = async (body: NewIngredient) => {
  return await db.insert(ingredients).values(body).returning();
};

export const deleteOne = async (id: number) => {
  const result = await db.delete(ingredients).where(eq(ingredients.id, id));
  return result;
};
