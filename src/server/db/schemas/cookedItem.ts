import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./user";
import { items } from "./item";
import { orders } from "./order";

export const cookedItems = sqliteTable("cooked_items", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuid()),
  itemId: text("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
});

export const cookedItemsRelations = relations(cookedItems, ({ one }) => ({
  item: one(items, {
    fields: [cookedItems.itemId],
    references: [items.id],
  }),
  order: one(orders, {
    fields: [cookedItems.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [cookedItems.userId],
    references: [users.id],
  }),
}));

export const cookedItemsSchema = createSelectSchema(cookedItems);
export const newCookedItemSchema = createInsertSchema(cookedItems);

export type CookedItem = typeof cookedItems.$inferSelect;
export type NewCookedItem = typeof cookedItems.$inferInsert;
