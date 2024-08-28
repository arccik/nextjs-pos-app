import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  getOne,
  create,
  update,
  deleteOne,
  getByBillId,
  totalSales,
  totalSoldItems,
  mostSoldItems,
  getMonthlyPaymentTotals,
} from "@/server/models/payment";
import { paymentSchema } from "@/server/db/schemas";

export const paymentRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getOne(input.id);
    }),
  getAll: protectedProcedure
    .input(z.object({ billId: z.string() }))
    .query(async ({ input }) => {
      return await getByBillId(input.billId);
    }),
  create: protectedProcedure
    .input(
      z.object({
        paymentMethod: z.enum(["Card", "Cash"]),
        chargedAmount: z.number(),
        billId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await create({ ...input, userId: ctx.session.user.id });
    }),
  update: protectedProcedure
    .input(paymentSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await update(input);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteOne(input.id);
    }),
  getTotalSales: protectedProcedure.query(async () => {
    return await totalSales();
  }),
  getTotalSoldItems: protectedProcedure.query(async () => {
    return await totalSoldItems();
  }),
  mostSoldItems: protectedProcedure.query(async () => {
    return await mostSoldItems();
  }),
  getMonthlyPaymentTotals: protectedProcedure.query(async () => {
    return await getMonthlyPaymentTotals();
  }),
});
