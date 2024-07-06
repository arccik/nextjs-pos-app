import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { nutritions } from "./nutritions";
import { relations } from "drizzle-orm";

export const ingredients = sqliteTable("ingredients", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name").notNull(),
  stock: integer("stock").default(0).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  nutritionId: integer("nutrition_id").references(() => nutritions.id),
});

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  nutrition: one(nutritions, {
    fields: [ingredients.nutritionId],
    references: [nutritions.id],
  }),
}));

export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;
