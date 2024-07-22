import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Item, items } from "./item";
import { Table, tables } from "./table";
import { User, users } from "./user";
import { z } from "zod";
import { Bill, bills } from "./bill";

export const orderStatus = [
  "Pending",
  "Ready",
  "In Progress",
  "Completed",
  "Cancelled",
  "Served",
] as const;

export const orders = sqliteTable("orders", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuid()),
  userId: text("userId", { length: 255 }).references(() => users.id),
  tableId: text("table_id").references(() => tables.id),
  isPaid: integer("is_paid", { mode: "boolean" }).default(false).notNull(),
  status: text("order_status", { enum: orderStatus })
    .default("Pending")
    .notNull(),
  specialRequest: text("special_request"),
  billId: text("bill_id"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const orderItems = sqliteTable(
  "order_items",
  {
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id),
    quantity: integer("quantity").notNull().default(1),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.orderId, t.itemId] }),
  }),
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  table: one(tables, {
    fields: [orders.tableId],
    references: [tables.id],
  }),
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  bill: one(bills, {
    fields: [orders.billId],
    references: [bills.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  items: one(items, {
    fields: [orderItems.itemId],
    references: [items.id],
  }),
  orders: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const ordersSchema = createSelectSchema(orders);
export const newOrderSchema = createInsertSchema(orders);
export const orderItemsSchema = createInsertSchema(orderItems);

export const newOrderWithItemsSchema = newOrderSchema.extend({
  items: orderItemsSchema.omit({ orderId: true }).array(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type NewOrderWithItems = z.infer<typeof newOrderWithItemsSchema>;

export type OrderStatus = typeof orderStatus;

export type OrderItemsWithOrderAndItems = {
  orders: Order;
  items: Item;
  order_items: OrderItem;
  users: User;
  tables: Table;
};
export type OrderWithUser = Order & { user: User };
export type OrderWithUserAndBill = OrderWithUser & { bill: Bill; user: User };
