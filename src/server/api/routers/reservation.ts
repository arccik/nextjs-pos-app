import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { reservations } from "../../db/schemas";
import { getUnAssignedReservations } from "@/server/db/models/reservation";

export const reservationRouter = createTRPCRouter({
  getUnAssignedReservations: publicProcedure.query(async () => {
    return await getUnAssignedReservations();
  }),
});
