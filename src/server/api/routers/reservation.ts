import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  getUnAssignedReservations,
  getAll,
  create,
  deleteOne,
  timeSlots,
} from "@/server/models/reservation";
import {
  getTimeSlotSchema,
  newReservationSchema,
} from "@/server/db/schemas/reservation";
import { z } from "zod";

export const reservationRouter = createTRPCRouter({
  getUnAssignedReservations: protectedProcedure.query(async () => {
    return await getUnAssignedReservations();
  }),
  getAll: protectedProcedure.query(async () => {
    return await getAll();
  }),
  create: protectedProcedure
    .input(newReservationSchema)
    .mutation(async ({ input, ctx }) => {
      return await create({
        ...input,
        userId: ctx.session.user.id,
        expireAt: input.expireAt ?? input.scheduledAt,
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteOne(input.id);
    }),
  timeSlots: protectedProcedure
    .input(getTimeSlotSchema)
    .query(async ({ input }) => {
      return await timeSlots(input);
    }),
});
