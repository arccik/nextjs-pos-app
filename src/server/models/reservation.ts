import {
  type NewReservation,
  type Reservation,
  reservations,
  type GetTimeSlot,
} from "../db/schemas/reservation";
import { db } from "../db";
import { and, eq, isNull } from "drizzle-orm";
import {
  type StoreSettings,
  storeRegularSchedule,
  storeSettings,
} from "../db/schemas";
import { generateTimeSlots } from "@/lib/utils";

export const getAll = async () => {
  return await db.select().from(reservations);
};

export const getOne = async (id: string) => {
  return await db.select().from(reservations).where(eq(reservations.id, id));
};

export const create = async (body: NewReservation) => {
  return await db
    .insert(reservations)
    .values(body)
    .returning({ id: reservations.id });
};
export const deleteOne = async (id: string) => {
  return await db.delete(reservations).where(eq(reservations.id, id));
};
export const update = async (body: Reservation) => {
  return await db
    .update(reservations)
    .set(body)
    .where(eq(reservations.id, body.id))
    .returning({ id: reservations.id });
};
export const timeSlots = async ({ tableId, date }: GetTimeSlot) => {
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
        : and(eq(reservations.scheduledAt, date), isNull(reservations.tableId)),
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
