import { sql } from "drizzle-orm";
import { text, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const dayOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const storeSettings = sqliteTable("store_settings", {
  profileName: text("profile_name").default("default").primaryKey().notNull(),
  storeForceClose: integer("store_force_close", { mode: "boolean" })
    .default(false)
    .notNull(),
  reservationInterval: integer("reservation_interval"),
  reservationDuration: integer("reservation_duration"),
  reservationNotArrivalExpirationTime: integer(
    "reservation_not_arrival_expiration_time",
  ),
  tableNumberLeadingZeros: integer("table_leading_zeros", { mode: "boolean" })
    .default(false)
    .notNull(),
  leadingZerosQuantity: integer("leading_zeros_quantity").default(1).notNull(),
  serviceFee: real("service_fee"),
});

export const storeRegularSchedule = sqliteTable("store_regular_working_times", {
  number: integer("number").primaryKey().notNull(),
  day: text("day", { enum: dayOfWeek }).notNull(),
  openTime: text("open_time"),
  closeTime: text("close_time"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
});

export const storeCustomSchedule = sqliteTable("store_custom_working_times", {
  date: integer("date", { mode: "timestamp" }).default(sql`(CURRENT_DATE)`),
  name: text("name").notNull(),
  openTime: text("open_time"),
  closeTime: text("close_time"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
});

export type StoreSettings = typeof storeSettings.$inferSelect;
export type NewStoreSettings = typeof storeSettings.$inferInsert;

export type StoreRegularSchedule = typeof storeRegularSchedule.$inferSelect;
export type NewStoreRegularSchedule = typeof storeRegularSchedule.$inferInsert;

export type StoreCustomSchedule = typeof storeCustomSchedule.$inferSelect;
export type NewStoreCustomSchedule = typeof storeCustomSchedule.$inferInsert;
