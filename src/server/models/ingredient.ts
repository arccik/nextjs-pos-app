import { eq } from "drizzle-orm";

import { db } from "..";
import { NewIngredient, ingredients } from "../schemas";

export const getOne = async (id: string) => {
  try {
    return await db.query.ingredients.findFirst({
      where: eq(ingredients.id, id),
    });
  } catch (error) {
    console.log(error);
    return { error: "[db:getOneingredients] Went wrong.." };
  }
};
export const getAll = async () => {
  try {
    return await db.query.ingredients.findMany();
  } catch (error) {
    console.log(error);
    return { error: "[db:getManyIngredient] Went wrong.." };
  }
};
export const update = async (id: string, body: NewIngredient) => {
  try {
    return await db
      .update(ingredients)
      .set(body)
      .where(eq(ingredients.id, id))
      .returning();
  } catch (error) {
    console.log(error);
    return { error: "[db:getManyIngredient] Went wrong.." };
  }
};

export const create = async (body: NewIngredient) => {
  try {
    return await db.insert(ingredients).values(body).returning();
  } catch (error) {
    console.log(error);
    return { error: "[db:createIngredient] Went wrong.." };
  }
};

export const deleteOne = async (id: string) => {
  try {
    const result = await db.delete(ingredients).where(eq(ingredients.id, id));
    return result;
  } catch (error) {
    console.log(error);
    return { error: "[db:deleteIngredient] Went wrong.." };
  }
};
