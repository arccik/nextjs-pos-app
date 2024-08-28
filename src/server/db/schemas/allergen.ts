import { pgTable, varchar } from "drizzle-orm/pg-core";

export const allergens = pgTable("allergens", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
});

export type Allergens = typeof allergens.$inferSelect;
export type NewAllergens = typeof allergens.$inferInsert;
