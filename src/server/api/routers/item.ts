import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  getOne,
  getAll,
  create,
  update,
  deleteOne,
} from "@/server/models/item";
import { newItemSchema } from "@/server/db/schemas";

export const itemRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getOne(input.id);
    }),
  getAll: protectedProcedure.query(async () => {
    return await getAll();
  }),
  create: protectedProcedure
    .input(newItemSchema)
    .mutation(async ({ input }) => {
      return await create(input);
    }),
  update: protectedProcedure
    .input(newItemSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await update(input);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteOne(input.id);
    }),
});
