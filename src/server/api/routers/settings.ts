import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { newVenueSettingsSchema, venueSettings } from "../../db/schemas";
import { eq } from "drizzle-orm";

export const settingsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(newVenueSettingsSchema.omit({ updatedBy: true }))
    .mutation(async ({ ctx, input }) => {
      const id = input.id;
      if (id) {
        const isExist = await ctx.db.query.venueSettings.findFirst({
          where: eq(venueSettings.id, id),
        });
        if (isExist) {
          return await ctx.db
            .update(venueSettings)
            .set({ ...input, updatedBy: ctx.session.user.id })
            .where(eq(venueSettings.id, id));
        }
      }
      return await ctx.db
        .insert(venueSettings)
        .values({ ...input, updatedBy: ctx.session.user.id });
    }),
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.venueSettings.findFirst();
  }),
  getName: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.venueSettings.findFirst({
      columns: {
        name: true,
        email: true,
      },
    });
  }),
});
