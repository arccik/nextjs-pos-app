import { reservationRouter } from "@/server/api/routers/reservation";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import {
  tableRouter,
  settingsRouter,
  orderRouter,
  billRouter,
  categoryRouter,
  itemRouter,
  userRouter,
  rotaRouter,
  cookedItemRouter,
  paymentRouter,
  notificationRouter,
} from "./routers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  reservation: reservationRouter,
  table: tableRouter,
  settings: settingsRouter,
  order: orderRouter,
  bill: billRouter,
  category: categoryRouter,
  item: itemRouter,
  user: userRouter,
  rota: rotaRouter,
  cookedItem: cookedItemRouter,
  payment: paymentRouter,
  notification: notificationRouter,
  // analytics:
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
