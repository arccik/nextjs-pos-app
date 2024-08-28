import { relations } from "drizzle-orm";
import {
  integer,
  text,
  real,
  pgTable,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { categories } from "./category";
import { orderItems } from "./order";
import { timestamp } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: real("price").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  isVegetarian: boolean("vegetarian"),
  isVegan: boolean("vegan"),
  isGlutenFree: boolean("gluten_free"),
  isSpicy: boolean("spicy"),
  preparationTime: integer("preparation_time").notNull(),
  categoryId: varchar("category_id", { length: 255 })
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  isAvailable: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
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
