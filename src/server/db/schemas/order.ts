import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { items } from "./item";
import { tables } from "./table";
import { type User, users } from "./user";
import { z } from "zod";
import { type Bill, bills } from "./bill";

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
  userId: text("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  selectedBy: text("selected_by", { length: 255 }).references(() => users.id, {
    onDelete: "set null",
  }),
  tableId: text("table_id").references(() => tables.id, {
    onDelete: "set null",
  }),
  isPaid: integer("is_paid", { mode: "boolean" }).default(false).notNull(),
  status: text("order_status", { enum: orderStatus })
    .default("Pending")
    .notNull(),
  specialRequest: text("special_request"),
  billId: text("bill_id").references(() => bills.id, {
    onDelete: "set null",
  }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$default(() => new Date())
    .notNull(),
});

export const orderItems = sqliteTable(
  "order_items",
  {
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .$default(() => new Date())
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$default(() => new Date())
      .notNull(),
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
  creator: one(users, {
    relationName: "creator",
    fields: [orders.userId],
    references: [users.id],
  }),
  selector: one(users, {
    relationName: "selector",
    fields: [orders.selectedBy],
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


export type OrderWithUser = Order & { user: User };
export type OrderWithUserAndBill = OrderWithUser & { bill: Bill; user: User };
