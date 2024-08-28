import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./user";
import { items } from "./item";
import { orders } from "./order";

export const cookedItems = pgTable("cooked_items", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  itemId: varchar("item_id", { length: 255 })
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  orderId: varchar("order_id", { length: 255 })
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
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
