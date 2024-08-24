import { text, sqliteTable, int, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

import { users } from "./user";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const shift = ["morning", "evening", "night"] as const;

export const rotas = sqliteTable("rota", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name"),
  shift: text("shift", { enum: shift }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  date: int("created_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
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
