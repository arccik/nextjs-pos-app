import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { insertTableSchema, tableStatusEnum, tables } from "../../db/schemas";
import { eq } from "drizzle-orm";
import {
  getAll,
  getOne,
  getSelectedTable,
  setSelectedTable,
  unselectTable,
  getAllByStatus,
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
      const userId = ctx.session.user.id;
      console.log("Set TABLE ::: ", { user: ctx.session.user.id, input });
      return await setSelectedTable({ id: input, userId });
    }),
  getSelectedTable: protectedProcedure.query(async ({ ctx }) => {
    return await getSelectedTable(ctx.session.user.id);
  }),
  unselectTable: protectedProcedure
    .input(z.object({ tableId: z.string() }))
    .mutation(async ({ input }) => {
      return await unselectTable(input.tableId);
    }),
  getAllByStatus: protectedProcedure
    .input(z.enum(tableStatusEnum))
    .query(async ({ input }) => await getAllByStatus(input)),
});
