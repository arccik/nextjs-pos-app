import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { insertTableSchema, tables } from "../../db/schemas";
import { eq } from "drizzle-orm";
import { get } from "http";
import {
  getAll,
  getOne,
  getSelectedTable,
  setSelectedTable,
} from "@/server/models/table";
import { z } from "zod";

export const tableRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertTableSchema)
    .mutation(async ({ input, ctx }) => {
      const isExist = await ctx.db.query.tables.findFirst({
        where: eq(tables.number, input.number),
      });
      if (isExist) return { error: "Table number already exist" };
      await ctx.db.insert(tables).values(input);
      return {
        success: true,
      };
    }),
  getOne: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => await getOne(input)),
  getAll: protectedProcedure.query(async () => await getAll()),
  setSelectedTable: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await setSelectedTable(input,ctx.session.user.id);
    }),
  getSelectedTable: protectedProcedure.query(async ({ ctx }) => {
    return await getSelectedTable(ctx.session.user.id);
  }),
});
