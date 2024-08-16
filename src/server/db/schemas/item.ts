import { relations, sql } from "drizzle-orm";
import { integer, text, real, sqliteTable } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { categories } from "./category";
import { orderItems } from "./order";

export const items = sqliteTable("items", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name", { length: 255 }).notNull(),
  description: text("description"),
  price: real("price").notNull(),
  imageUrl: text("image_url", { length: 255 }),
  isVegetarian: integer("vegetarian", { mode: "boolean" }),
  isVegan: integer("vegan", { mode: "boolean" }),
  isGlutenFree: integer("gluten_free", { mode: "boolean" }),
  isSpicy: integer("spicy", { mode: "boolean" }),
  preparationTime: integer("preparation_time").notNull(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
  isAvailable: integer("available", { mode: "boolean" }).default(true),
});

export const itemRelations = relations(items, ({ one, many }) => ({
  category: one(categories),
  orderItems: many(orderItems),
}));

export const categoryRelations = relations(categories, ({ one }) => ({
  item: one(items, {
    fields: [categories.id],
    references: [items.categoryId],
  }),
}));

export const itemsSchema = createSelectSchema(items);
export const newItemSchemaRaw = createInsertSchema(items);

export const newItemSchema = newItemSchemaRaw.extend({
  preparationTime: z.coerce.number().min(1, { message: "Required" }),
  name: z.string().min(1, { message: "Required" }),
  // categoryId: z.string({ invalid_type_error: "Required" }).min(0),
  price: z.coerce.number().min(1, { message: "Required" }),
});
export type NewItemSchemaType = z.infer<typeof newItemSchema>;
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
