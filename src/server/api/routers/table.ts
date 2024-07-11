import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { insertTableSchema, tables } from "../../db/schemas";
import { eq } from "drizzle-orm";

export const tableRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertTableSchema)
    .query(async ({ input, ctx }) => {
      const isExist = await ctx.db.query.tables.findFirst({
        where: eq(tables.number, input.number),
      });
      if (isExist) return { error: "Table number already exist" };
      ctx.db.insert(tables).values(input);
      return {
        success: true,
      };
    }),
});
