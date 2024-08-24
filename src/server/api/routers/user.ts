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
import { newUserSchema, updateUserSchema } from "@/server/db/schemas";

export const userRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.string()).query(async ({ input }) => {
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
    .input(z.string())
    .mutation(async ({ input }) => {
      return await deleteOne(input);
    }),
  update: protectedProcedure
    .input(updateUserSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      console.log("UPDATE USER: ?? !!! ", input);
      return await update({ id: input.id, body: { ...input } });
    }),
});
