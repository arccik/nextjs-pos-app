import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  getOne,
  getAll,
  create,
  update,
  deleteOne,
  getTodayTotal,
  getMostPopular,
  getPopularItem,
} from "@/server/models/cookedItem";
import { newCookedItemSchema } from "@/server/db/schemas";

export const cookedItemRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getOne(input.id);
    }),
  getAll: protectedProcedure
    .input(z.string().optional())
    .query(async ({ input }) => {
      return await getAll(input);
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), data: newCookedItemSchema.partial() }))
    .mutation(async ({ input, ctx }) => {
      return await update(input.id, {
        ...input.data,
        userId: ctx.session.user.id,
      });
    }),
  delete: protectedProcedure
    .input(z.object({ itemId: z.string(), orderId: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteOne(input);
    }),
  create: protectedProcedure
    .input(newCookedItemSchema.omit({ userId: true }))
    .mutation(async ({ input, ctx }) => {
      return await create({ ...input, userId: ctx.session.user.id });
    }),
  getTodayTotal: protectedProcedure.query(async () => {
    return await getTodayTotal();
  }),
  getMostPopular: protectedProcedure.query(async () => {
    return await getMostPopular();
  }),
  getPopularItems: protectedProcedure.query(async () => {
    return await getPopularItem();
  }),
});
