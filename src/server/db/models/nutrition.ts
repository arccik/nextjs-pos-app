import { eq } from "drizzle-orm";

import { db } from "..";
import { Nutrition, nutritions } from "../schemas";

export const getOne = async (id: number) => {
  try {
    return await db.query.nutritions.findFirst({
      where: eq(nutritions.id, id),
    });
  } catch (error) {
    console.log(error);
    return { error: "[db:getOneNutrition] Went wrong.." };
  }
};
export const getAll = async () => {
  try {
    return await db.query.nutritions.findMany();
  } catch (error) {
    console.log(error);
    return { error: "[db:getManyNutrition] Went wrong.." };
  }
};
export const update = async (id: number, body: Nutrition) => {
  try {
    return await db
      .update(nutritions)
      .set(body)
      .where(eq(nutritions.id, id))
      .returning();
  } catch (error) {
    console.log(error);
    return { error: "[db:getManyNutrition] Went wrong.." };
  }
};

export const create = async (body: Nutrition) => {
  try {
    return await db.insert(nutritions).values(body).returning();
  } catch (error) {
    console.log(error);
    return { error: "[db:createNutrition] Went wrong.." };
  }
};

export const deleteOne = async (id: number) => {
  try {
    const result = await db.delete(nutritions).where(eq(nutritions.id, id));
    return result;
  } catch (error) {
    console.log(error);
    return { error: "[db:deleteNutrition] Went wrong.." };
  }
};
