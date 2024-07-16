// import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const categories = sqliteTable("category", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name", { length: 255 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(CURRENT_DATE)`,
  ),
});

export const categoriesSchema = createSelectSchema(categories);
export const newCategoriesSchema = createInsertSchema(categories);
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
