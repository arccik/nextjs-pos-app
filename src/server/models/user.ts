import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "../db";
import { type NewUser, type UpdateUser, users } from "../db/schemas/user";

export const getOne = async (id: string) => {
  return await db.query.users.findFirst({
    columns: { password: false },
    where: eq(users.id, id),
    with: { profileInfo: true },
  });
};
export const getAll = async () => {
  return await db.query.users.findMany({
    columns: { password: false, email: false },
  });
};

type UpdateUserProp = {
  id: string;
  body: Omit<UpdateUser, "role">;
};
export const update = async ({ id, body }: UpdateUserProp) => {
  const user = await getOne(id);
  if (!user) return null;
  if (body.password) {
    const password = await bcrypt.hash(body.password, 10);
    body.password = password;
  }
  return await db.update(users).set(body).where(eq(users.id, id)).returning();
};

export const create = async (body: NewUser) => {
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
