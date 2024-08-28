import {
  text,
  pgTable,
  integer,
  boolean,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nutritions } from "./nutritions";
import { relations } from "drizzle-orm";

export const ingredients = pgTable("ingredients", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  stock: integer("stock").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  nutritionId: varchar("nutrition_id", { length: 255 }).references(
    () => nutritions.id,
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  nutrition: one(nutritions, {
    fields: [ingredients.nutritionId],
    references: [nutritions.id],
  }),
}));

export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;
