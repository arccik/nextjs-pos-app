import { eq } from "drizzle-orm";

import { db } from "../db";
import { NewUser, UpdateUser, type User, users } from "../db/schemas/user";

export const getOne = async (id: string) => {
  let response = await db.query.users.findFirst({
    where: eq(users.id, id),
    with: { profileInfo: true },
  });
  if (!response) return null;
  const { password, ...user } = response;
  return user;
};
export const getAll = async () => {
  return await db.query.users.findMany();
};

type UpdateUserProp = {
  id: string;
  body: UpdateUser;
};
export const update = async ({ id, body }: UpdateUserProp) => {
  const user = await getOne(id);
  if (!user) return null;
  return await db.update(users).set(body).where(eq(users.id, id)).returning();
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
