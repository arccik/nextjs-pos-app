import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { relations } from "drizzle-orm";

import { tables } from "./table";

export const reservationStatusEnum = [
  "Scheduled",
  "In Progress",
  "Expired",
  "Finished",
  "Cancelled",
] as const;

export const reservations = sqliteTable("reservations", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuid()),
  tableId: text("table_id").references(() => tables.id),
  customerName: text("customer_name").notNull(),
  customerPhoneNumber: text("customer_phone_number"),
  customerEmail: text("customer_email"),
  guestsPredictedNumber: integer("guest_predicted_number"),
  specialRequests: text("special_requests"),
  notes: text("notes"),
  status: text("status", { enum: reservationStatusEnum })
    .default("Scheduled")
    .notNull(),
  scheduledAt: text("scheduled_at", { length: 255 }).notNull(),
  expireAt: text("expire_at", { length: 255 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
});

export const tablesRelations = relations(tables, ({ many }) => ({
  reservations: many(reservations),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  table: one(tables, {
    fields: [reservations.id],
    references: [tables.id],
  }),
}));

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
export const reservationSchema = createSelectSchema(reservations);
export const newReservationSchema = createInsertSchema(reservations, {
  tableId: z.coerce.string().optional(),
  customerName: z.string().min(1, "Required").max(30),
  customerEmail: z
    .string()
    .email({ message: "Incorrect Email" })
    .optional()
    .or(z.literal("").transform(() => undefined)),
  customerPhoneNumber: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  guestsPredictedNumber: z.coerce.number().min(1),
  specialRequests: z
    .string()
    .min(2)
    .max(255)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  notes: z
    .string()
    .min(2)
    .max(255)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export const getTimeSlotSchema = z.object({
  tableId: z.string().optional(),
  date: z.string(),
});
export type GetTimeSlot = z.infer<typeof getTimeSlotSchema>;
