import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const allergens = sqliteTable("allergens", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name").notNull(),
});

export type Allergens = typeof allergens.$inferSelect;
export type NewAllergens = typeof allergens.$inferInsert;
