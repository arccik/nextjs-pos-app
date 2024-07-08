import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const allergens = sqliteTable("allergens", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name"),
});

export type Allergens = typeof allergens.$inferSelect;
export type NewAllergens = typeof allergens.$inferInsert;
