import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Item, items } from "./item";
import { Table, tables } from "./table";
import { User, users } from "./user";
import { z } from "zod";
import { Bill, bills } from "./bill";

export const orderStatus = [
  "Ready",
  "In Progress",
  "Completed",
  "Cancelled",
  "Served",
] as const;

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  userId: integer("user_id").notNull(),
  tableId: integer("table_id").references(() => tables.id),
  isPaid: integer("is_paid", { mode: "boolean" }).default(false).notNull(),
  status: text("order_status", { enum: orderStatus })
    .default("In Progress")
    .notNull(),
  specialRequest: text("special_request"),
  billId: integer("bill_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(CURRENT_DATE)`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(CURRENT_DATE)`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const orderItems = sqliteTable(
  "order_items",
  {
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id),
    itemId: integer("item_id")
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
