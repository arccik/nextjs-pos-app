import { text, sqliteTable, int } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

import { users } from "./user";
import { relations, sql } from "drizzle-orm";
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
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
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
