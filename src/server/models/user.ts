import { eq } from "drizzle-orm";

import { db } from "../db";
import { NewUser, type User, users } from "../db/schemas/user";

export const getOne = async (id: string) => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
    with: { profileInfo: true },
  });
};
export const getAll = async () => {
  return await db.query.users.findMany();
};
export const update = async (body: User) => {
  return await db
    .update(users)
    .set(body)
    .where(eq(users.id, body.id))
    .returning();
};

export const create = async (body: NewUser) => {
  console.log("Creating user :::: ", body);
  return await db.insert(users).values(body).returning();
};

export const deleteOne = async (id: string) => {
  return await db.delete(users).where(eq(users.id, id));
};

export const isExist = async (email: string) => {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  });
};
