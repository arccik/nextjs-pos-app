import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  newItemSchema,
  newOrderSchema,
  newOrderWithItemsSchema,
  orderItemsSchema,
} from "../../db/schemas";
import {
  addMoreItemsToOrder,
  addItem,
  create,
  getAll,
  getOne,
  getOneByTableId,
  getRecentOrders,
  pay,
  recentCompletedOrders,
} from "@/server/models/order";

export const orderRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getOne(input.id);
    }),
  getAll: protectedProcedure.query(async () => {
    return await getAll();
  }),
  create: protectedProcedure
    .input(newOrderWithItemsSchema)
    .mutation(async ({ input }) => {
      return await create(input);
    }),
  addItems: protectedProcedure
    .input(newItemSchema)
    .mutation(async ({ input }) => {
      return await addItem(input);
    }),
  getOneByTableId: protectedProcedure
    .input(z.object({ tableId: z.number() }))
    .query(async ({ input }) => {
      return await getOneByTableId(input.tableId);
    }),
  getRecentOrders: protectedProcedure.query(async () => {
    return await getRecentOrders();
  }),
  getRecentCompletedOrders: protectedProcedure
    .input(z.object({ tableId: z.number() }))
    .query(async ({ input }) => {
      return await recentCompletedOrders(input.tableId);
    }),

  addMoreItemsToOrder: protectedProcedure
    .input(orderItemsSchema.array())
    .mutation(async ({ input }) => {
      return await addMoreItemsToOrder(input);
    }),
});
