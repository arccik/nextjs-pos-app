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
  getOne: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await getOne(input);
  }),
  getAll: protectedProcedure.query(async () => {
    return await getAll();
  }),
  create: protectedProcedure
    .input(newUserSchema)
    .mutation(async ({ input }) => {
      const password = await bcrypt.hash(input.password!, 10);
      return await create({ ...input, password });
    }),
  deleteOne: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await deleteOne(input);
    }),
  update: protectedProcedure
    .input(
      newUserSchema.extend({
        id: z.string(),
        password: z.string().optional(),
        updatedAt: z.date().nullable().optional(),
        createdAt: z.date().nullable().optional(),
        email: z.string().email().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("UPDATE USER: ?? !!! ", input);
      return await update({ id: input.id, body: { ...input } });
    }),
});
