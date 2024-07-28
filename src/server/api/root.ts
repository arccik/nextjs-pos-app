import { reservationRouter } from "@/server/api/routers/reservation";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { tableRouter } from "./routers/table";
import { settingsRouter } from "./routers/settings";
import { orderRouter } from "./routers/order";
import { billRouter } from "./routers/bill";
import { categoryRouter } from "./routers/category";
import { itemRouter } from "./routers/item";
import { userRouter } from "./routers/user";
import { rotaRouter } from "./routers/rota";

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
