import { sql } from "drizzle-orm";
import { boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { text, integer, real, pgTable } from "drizzle-orm/pg-core";

export const dayOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const storeSettings = pgTable("store_settings", {
  profileName: text("profile_name").default("default").primaryKey().notNull(),
  storeForceClose: boolean("store_force_close").default(false).notNull(),
  reservationInterval: integer("reservation_interval"),
  reservationDuration: integer("reservation_duration"),
  reservationNotArrivalExpirationTime: integer(
    "reservation_not_arrival_expiration_time",
  ),
  tableNumberLeadingZeros: boolean("table_leading_zeros")
    .default(false)
    .notNull(),
  leadingZerosQuantity: integer("leading_zeros_quantity").default(1).notNull(),
  serviceFee: real("service_fee"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const storeRegularSchedule = pgTable("store_regular_working_times", {
  number: integer("number").primaryKey().notNull(),
  day: varchar("day", { enum: dayOfWeek }).notNull(),
  openTime: text("open_time"),
  closeTime: text("close_time"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const storeCustomSchedule = pgTable("store_custom_working_times", {
  date: timestamp("created_at").defaultNow().notNull(),
  name: text("name").notNull(),
  openTime: text("open_time"),
  closeTime: text("close_time"),
  isActive: boolean("is_active").default(true).notNull(),
});

export type StoreSettings = typeof storeSettings.$inferSelect;
export type NewStoreSettings = typeof storeSettings.$inferInsert;

export type StoreRegularSchedule = typeof storeRegularSchedule.$inferSelect;
export type NewStoreRegularSchedule = typeof storeRegularSchedule.$inferInsert;

export type StoreCustomSchedule = typeof storeCustomSchedule.$inferSelect;
export type NewStoreCustomSchedule = typeof storeCustomSchedule.$inferInsert;
