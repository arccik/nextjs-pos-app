import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getOne, getAll, getByDate } from "@/server/models/rota";

export const rotaRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getOne(input.id);
    }),
  getAll: protectedProcedure.query(async () => {
    return await getAll();
  }),
  getByDate: protectedProcedure.input(z.date()).mutation(async ({ input }) => {
    return await getByDate(input);
  }),
});
