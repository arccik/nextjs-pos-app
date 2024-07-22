import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  newItemSchema,
  newOrderSchema,
  newOrderWithItemsSchema,
  orderItemsSchema,
  itemsSchema,
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
  getOrderWithItems,
  recentCompletedOrders,
  addSpecialRequest,
  getSpecialRequest,
} from "@/server/models/order";

export const orderRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getOne(input.id);
    }),
  getAll: protectedProcedure.query(async () => {
    return await getAll();
  }),
  getOrderWithItems: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getOrderWithItems(input.id);
    }),
  create: protectedProcedure
    .input(newOrderWithItemsSchema)
    .mutation(async ({ input }) => {
      return await create(input);
    }),
  addItems: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        orderId: z.string().nullable(),
        quantity: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await addItem({
        userId: ctx.session.user.id,
        ...input,
      });
    }),
  getOneByTableId: protectedProcedure
    .input(z.object({ tableId: z.string() }))
    .query(async ({ input }) => {
      return await getOneByTableId(input.tableId);
    }),
  getRecentOrders: protectedProcedure.query(async () => {
    return await getRecentOrders();
  }),
  getRecentCompletedOrders: protectedProcedure
    .input(z.object({ tableId: z.string() }))
    .query(async ({ input }) => {
      return await recentCompletedOrders(input.tableId);
    }),

  addMoreItemsToOrder: protectedProcedure
    .input(orderItemsSchema.array())
    .mutation(async ({ input }) => {
      return await addMoreItemsToOrder(input);
    }),
  addSpecialRequest: protectedProcedure
    .input(z.object({ request: z.string(), orderId: z.string() }))
    .mutation(async ({ input }) => {
      return await addSpecialRequest(input);
    }),
  getSpecialRequest: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      return await getSpecialRequest({ orderId: input.orderId });
    }),
});
