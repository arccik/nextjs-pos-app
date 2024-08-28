import { eq } from "drizzle-orm";

import { db } from "../db";
import { type Nutrition, nutritions } from "../db/schemas";

export const getOne = async (id: number) => {
  return await db.query.nutritions.findFirst({
    where: eq(nutritions.id, id),
  });
};
export const getAll = async () => {
  return await db.query.nutritions.findMany();
};
export const update = async (id: number, body: Nutrition) => {
  return await db
    .update(nutritions)
    .set(body)
    .where(eq(nutritions.id, id))
    .returning();
};

export const create = async (body: Nutrition) => {
  return await db.insert(nutritions).values(body).returning();
};

export const deleteOne = async (id: number) => {
  const result = await db.delete(nutritions).where(eq(nutritions.id, id));
  return result;
};
