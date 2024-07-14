import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import bcrypt from "bcryptjs";

import {
  getOne,
  getAll,
  create,
  deleteOne,
  update,
} from "@/server/models/user";
import {
  newPaymentSchema,
  newUserSchema,
  userSchema,
} from "@/server/db/schemas";

export const userRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.number()).query(async ({ input }) => {
    return await getOne(input);
  }),
  getAll: protectedProcedure.query(async () => {
    return await getAll();
  }),
  create: protectedProcedure
    .input(newUserSchema)
    .mutation(async ({ input }) => {
      const password = await bcrypt.hash(input.password, 10);
      return await create({ ...input, password });
    }),
  deleteOne: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await deleteOne(input);
    }),
  update: protectedProcedure.input(userSchema).mutation(async ({ input }) => {
    return await update(input);
  }),
});
