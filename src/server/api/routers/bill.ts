import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  getOneByOrderId,
  generateBill,
  payBill,
  addTips,
} from "@/server/models/bill";
import { newPaymentSchema } from "@/server/db/schemas";

export const billRouter = createTRPCRouter({
  generateBill: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await generateBill(input.id);
    }),
  getOneByOrderId: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await getOneByOrderId(input);
    }),
  payBill: protectedProcedure
    .input(newPaymentSchema.extend({ userId: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      return await payBill({ ...input, userId: ctx.session.user.id });
    }),
  addTips: protectedProcedure
    .input(z.object({ billId: z.string(), amount: z.number() }))
    .mutation(async ({ input }) => {
      return await addTips(input.billId, input.amount);
    }),
});
