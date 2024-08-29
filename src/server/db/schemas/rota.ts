import {
  text,
  pgTable,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

import { users } from "./user";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const shift = ["morning", "evening", "night"] as const;

export const rotas = pgTable("rota", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  shift: varchar("shift", { enum: shift }),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  working: boolean("working").default(false).notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const rotaRelations = relations(rotas, ({ one }) => ({
  user: one(users, {
    fields: [rotas.userId],
    references: [users.id],
  }),
}));

export type Rota = typeof rotas.$inferSelect;
export type NewRota = typeof rotas.$inferInsert;

export const rotaSchema = createSelectSchema(rotas);
export const newRotaSchema = createInsertSchema(rotas);
export const rotaUpdateSchema = createInsertSchema(rotas);
