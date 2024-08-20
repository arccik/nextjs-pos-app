import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getUnAssignedReservations, getAll } from "@/server/models/reservation";

export const reservationRouter = createTRPCRouter({
  getUnAssignedReservations: protectedProcedure.query(async () => {
    return await getUnAssignedReservations();
  }),
  getAll: protectedProcedure.query(async () => {
    return await getAll();
  }),
});
