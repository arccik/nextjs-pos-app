import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { insertTableSchema, posts, tables } from "../../db/schemas";
import { eq } from "drizzle-orm";

export const tableRouter = createTRPCRouter({
  create: protectedProcedure
    .input(insertTableSchema)
    .query(async ({ input, ctx }) => {
      const isExist = await ctx.db.query.tables.findFirst({
        where: eq(tables.number, input.number),
      });
      if (isExist) return { error: "Table number already exist" };
      ctx.db
        .insert(posts)
        .values({ ...input, createdById: ctx.session.user.id });
      return {
        success: true,
      };
    }),
});
