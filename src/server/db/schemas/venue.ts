import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { v4 as uuid } from "uuid";

export const venueSettings = sqliteTable("venue_settings", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  managerName: text("manager_name"),
  description: text("description"),
  capacity: integer("capacity"),
  amenities: text("amenities"),
  accessibilityInformation: text("accessibility_information"),
  logo: text("logo"),
  acceptCash: integer("accept_cash", { mode: "boolean" }),
  acceptCredit: integer("accept_credit", { mode: "boolean" }),
  acceptMobilePayment: integer("accept_mobile_payment", { mode: "boolean" }),
  alloweManagerToEditMenu: integer("allow_manager_to_edit_menu", {
    mode: "boolean",
  }),
  allowedChashierToRefund: integer("allowed_cashier_to_refund", {
    mode: "boolean",
  }),
  allowedServersToModifyOrder: integer("allowed_servers_to_modify_order", {
    mode: "boolean",
  }),
  serviceFee: integer("service_fee"),
  currency: text("currency"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
});

export const venueSettingsSchema = createSelectSchema(venueSettings).extend({
  serviceFee: z.coerce.number(),
  capacity: z.coerce.number(),
});
export const newVenueSettingsSchema = createInsertSchema(venueSettings).extend({
  serviceFee: z.coerce.number().optional().nullable(),
  capacity: z.coerce.number().optional().nullable(),
});

export type VenueSettings = typeof venueSettings.$inferSelect;
export type NewVenueSettings = typeof venueSettings.$inferInsert;
