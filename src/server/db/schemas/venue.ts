import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const venueSettings = pgTable("venue_settings", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
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
  acceptCash: boolean("accept_cash"),
  acceptCredit: boolean("accept_credit"),
  acceptMobilePayment: boolean("accept_mobile_payment"),
  alloweManagerToEditMenu: boolean("allow_manager_to_edit_menu"),
  allowedChashierToRefund: boolean("allowed_cashier_to_refund"),
  allowedServersToModifyOrder: boolean("allowed_servers_to_modify_order"),
  serviceFee: integer("service_fee"),
  currency: text("currency"),
  updatedBy: varchar("updated_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
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
