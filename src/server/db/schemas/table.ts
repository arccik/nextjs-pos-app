import { text, sqliteTable, integer, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { Reservation } from "./reservation";
import { users } from "./user";
import { relations, sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const tableStatusEnum = [
  "available",
  "occupied",
  "reserved",
  "closed",
] as const;
export const tables = sqliteTable(
  "tables",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => uuid()),
    number: integer("number").notNull(),
    prefix: text("prefix", { length: 5 }),
    description: text("description"),
    seats: integer("seats").notNull(),
    selectedBy: text("userId", { length: 255 }).references(() => users.id),
    requireCleaning: integer("require_cleaning", { mode: "boolean" })
      .default(false)
      .notNull(),
    status: text("status", { enum: tableStatusEnum })
      .default("available")
      .notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(CURRENT_DATE)`)
      .notNull(),
    // updateCounter: integer("update_counter")
    //   .default(sql`1`)
    //   .$onUpdateFn(() => sql`update_counter + 1`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (t) => ({
    unq: unique().on(t.number, t.prefix),
  }),
);

export const tableRelations = relations(tables, ({ one }) => ({
  selectedBy: one(users, {
    fields: [tables.selectedBy],
    references: [users.id],
  }),
}));

export const selectTableSchema = createSelectSchema(tables);
export const insertTableSchema = createInsertSchema(tables, {
  number: z.coerce.number(),
  prefix: z
    .string()
    .trim()
    .max(5, { message: "The prefix must contain up to 5 letters" }),
  // .transform((v) => v ? v.replace(/\s+/g, '') : v),
  description: z
    .string()
    .max(100)
    .or(z.literal("").transform(() => undefined)),
  seats: z.coerce
    .number({ invalid_type_error: "Required" })
    .min(1, { message: "At least one seat must be presented" })
    .max(50, { message: "The maximum quantity of the seats is 50" }),
});

export type Table = z.infer<typeof selectTableSchema>;
export type NewTable = z.infer<typeof insertTableSchema>;
// export type TableStatus = typeof tableStatusEnum;
export type TableStatus = (typeof tableStatusEnum)[number];

export type TableWithReservation = Table & {
  reservations?: Reservation[];
  // user: User;
};
