import { eq, gte } from "drizzle-orm";

import { db } from "../db";
import { type NewRota, rotas } from "../db/schemas";

export const getOne = async (id: string) => {
  return await db.query.rotas.findFirst({
    where: eq(rotas.id, id),
  });
};
export const getAll = async () => {
  return await db.query.rotas.findMany();
};
export const getByDate = async (date: Date) => {
  return await db.query.rotas.findMany({
    where: gte(rotas.date, date),
  });
};
export const update = async ({ id, data }: { id: string; data: NewRota }) => {
  return db.update(rotas).set(data).where(eq(rotas.id, id));
};

export const saveRota = async (data: NewRota) => {
  return await db.insert(rotas).values(data).returning();
};