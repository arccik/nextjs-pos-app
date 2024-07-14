import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { categoriesSchema, newCategoriesSchema } from "@/server/db/schemas";
import {
  create,
  getAll,
  getOne,
  update,
  deleteOne,
} from "@/server/models/category";
import { z } from "zod";

export const categoryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getOne(input.id);
    }),
  getAll: protectedProcedure.query(async () => {
    return await getAll();
  }),
  update: protectedProcedure
    .input(categoriesSchema)
    .mutation(async ({ input }) => {
      return await update(input);
    }),
  create: protectedProcedure
    .input(newCategoriesSchema)
    .mutation(async ({ input }) => {
      return await create(input);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await deleteOne(input.id);
    }),
});
