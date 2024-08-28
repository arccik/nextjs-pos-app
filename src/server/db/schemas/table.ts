import {
  text,
  pgTable,
  integer,
  unique,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { type Reservation } from "./reservation";
import { type User, users } from "./user";
import { relations } from "drizzle-orm";

export const tableStatusEnum = [
  "available",
  "occupied",
  "reserved",
  "closed",
] as const;
export const tables = pgTable(
  "tables",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    number: integer("number").notNull(),
    prefix: varchar("prefix", { length: 5 }),
    description: text("description"),
    seats: integer("seats").notNull(),
    selectedBy: varchar("selected_by", { length: 255 }).references(
      () => users.id,
    ),
    requireCleaning: boolean("require_cleaning").default(false).notNull(),
    status: varchar("status", { enum: tableStatusEnum })
      .default("available")
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    unq: unique().on(t.number, t.prefix),
  }),
);

export const tableRelations = relations(tables, ({ one }) => ({
  user: one(users, {
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
  user?: User | null;
};
