import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { nutritions } from "./nutritions";
import { relations } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export const ingredients = sqliteTable("ingredients", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name").notNull(),
  stock: integer("stock").default(0).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  nutritionId: text("nutrition_id").references(() => nutritions.id),
});

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  nutrition: one(nutritions, {
    fields: [ingredients.nutritionId],
    references: [nutritions.id],
  }),
}));

export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;
