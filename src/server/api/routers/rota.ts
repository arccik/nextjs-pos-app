import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getOne, getAll, getByDate, saveRota } from "@/server/models/rota";
import { newRotaSchema, rotaSchema } from "@/server/db/schemas";

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
  // saveRota: protectedProcedure
  //   .input(z.array(newRotaSchema))
  //   .mutation(async ({ input }) => {
  //     return await saveRota(input);
  //   }),
});
