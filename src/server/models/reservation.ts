"use server";
import {
  NewReservation,
  type Reservation,
  reservations,
  GetTimeSlot,
} from "../db/schemas/reservation";
import { db } from "../db";
import { and, eq, isNull } from "drizzle-orm";
import {
  StoreSettings,
  storeRegularSchedule,
  storeSettings,
} from "../db/schemas";
import { generateTimeSlots } from "@/lib/utils";

export const getAll = async () => {
  try {
    return await db.select().from(reservations).execute();
  } catch (error_1) {
    console.error(error_1);
    return { error: "[db:getAllReservation] Went wrong.." };
  }
};

export const getOne = async (id: number) => {
  try {
    return await db.select().from(reservations).where(eq(reservations.id, id));
  } catch (error_1) {
    console.error(error_1);
    return { error: "[db:getOneReservation] Went wrong.." };
  }
};

export const create = async (body: NewReservation) => {
  try {
    return await db
      .insert(reservations)
      .values(body)
      .returning({ id: reservations.id });
  } catch (error_1) {
    console.error(error_1);
    return { error: "[db:createReservation] Went wrong.." };
  }
};
export const deleteOne = async (id: number) => {
  try {
    return await db.delete(reservations).where(eq(reservations.id, id));
  } catch (error_1) {
    console.error(error_1);
    return { error: "[db:deleteOneReservation] Went wrong.." };
  }
};
export const update = async (body: Reservation) => {
  try {
    return await db
      .update(reservations)
      .set(body)
      .where(eq(reservations.id, body.id))
      .returning({ id: reservations.id });
  } catch (error_1) {
    console.error(error_1);
    return { error: "[db:updateReservation] Went wrong.." };
  }
};
export const timeSlots = async ({ tableId, date }: GetTimeSlot) => {
  try {
    const settings: StoreSettings[] = await db
      .select()
      .from(storeSettings)
      .where(eq(storeSettings.profileName, "default"));

    const bookedReservations = await db
      .select()
      .from(reservations)
      .where(
        tableId
          ? and(
              eq(reservations.tableId, tableId),
              eq(reservations.scheduledAt, date),
            )
          : and(
              eq(reservations.scheduledAt, date),
              isNull(reservations.tableId),
            ),
      );

    const regularSchedule = await db.select().from(storeRegularSchedule);
    const { openTime, closeTime } = regularSchedule.find(
      (item) => item.number == new Date(date).getDay(),
    )!;

    if (!settings[0] || !openTime || !closeTime) return;

    const interval = settings[0].reservationInterval!;
    const duration = settings[0].reservationDuration!;
    return generateTimeSlots({
      date,
      openTime,
      closeTime,
      interval,
      duration,
      reservations: bookedReservations,
    });
  } catch (error) {
    console.error(error);
    return { error: "[db:generateTimeSlots] Went wrong.." };
  }
};

export const getUnAssignedReservations = () => {
  const date = new Date().toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return db
    .select()
    .from(reservations)
    .where(
      and(isNull(reservations.tableId), eq(reservations.scheduledAt, date)),
    );
};
