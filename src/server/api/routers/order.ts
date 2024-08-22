import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  newOrderSchema,
  newOrderWithItemsSchema,
  orderItemsSchema,
  orderStatus,
} from "../../db/schemas";
import {
  addMoreItemsToOrder,
  addItem,
  create,
  getAll,
  getOne,
  getOneByTableId,
  getRecentOrders,
  getOrderWithItems,
  recentCompletedOrders,
  addSpecialRequest,
  getSpecialRequest,
  deleteOne,
  getPendingOrder,
  getAllByStatus,
  newOrder,
  removeItemFromOrder,
  updateOrder,
  getOneByBillId,
  setOrderStatus,
  removeSpecialRequest,
  getSelectedByUser,
  unselectOrder,
} from "@/server/models/order";

export const orderRouter = createTRPCRouter({
  newOrder: protectedProcedure
    .input(newOrderSchema.optional())
    .mutation(async ({ input, ctx }) => {
      return newOrder({ ...input, userId: ctx.session.user.id });
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getOne(input.id);
    }),
  getAll: protectedProcedure
    .input(z.enum(orderStatus).optional())
    .query(async ({ input }) => {
      // if (input) return await getAllByStatus(input);
      return await getAll(input);
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
        orderId: z.string().optional(),
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
  removeSpecialRequest: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return await removeSpecialRequest(input);
    }),
  getSpecialRequest: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      return await getSpecialRequest({ orderId: input.orderId });
    }),
  deleteOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteOne(input.id);
    }),
  removeItemFromOrder: protectedProcedure
    .input(z.object({ itemId: z.string(), orderId: z.string() }))
    .mutation(async ({ input }) => {
      return await removeItemFromOrder(input);
    }),
  getPendingOrder: protectedProcedure.query(async ({ ctx }) => {
    return await getPendingOrder(ctx.session.user.id);
  }),
  updateOrder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        body: newOrderSchema.extend({ userId: z.string().optional() }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await updateOrder({
        id: input.id,
        body: { ...input.body, userId: ctx.session.user.id },
      });
    }),
  getByBillId: protectedProcedure
    .input(z.object({ billId: z.string() }))
    .query(async ({ input }) => {
      return await getOneByBillId(input.billId);
    }),
  setStatus: protectedProcedure
    .input(z.object({ orderId: z.string(), status: z.enum(orderStatus) }))
    .mutation(async ({ input }) => {
      return await setOrderStatus(input);
    }),
  getSelectedByUser: protectedProcedure.query(async ({ ctx }) => {
    return await getSelectedByUser(ctx.session.user.id);
  }),
  unselectOrder: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ input }) => {
      return await unselectOrder(input.orderId);
    }),
});
