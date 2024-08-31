import {
  integer,
  primaryKey,
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
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

export const orders = pgTable("orders", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  selectedBy: varchar("selected_by", { length: 255 }).references(
    () => users.id,
    {
      onDelete: "set null",
    },
  ),
  tableId: varchar("table_id", { length: 255 }).references(() => tables.id, {
    onDelete: "set null",
  }),
  isPaid: boolean("is_paid").default(false).notNull(),
  status: varchar("order_status", { enum: orderStatus })
    .default("Pending")
    .notNull(),
  guestLeft: boolean("guest_left").default(false).notNull(),
  specialRequest: text("special_request"),
  billId: varchar("bill_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const orderItems = pgTable(
  "order_items",
  {
    orderId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    itemId: varchar("item_id", { length: 255 })
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
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
  orderItems: many(orderItems),
  // bill: one(bills, {
  //   fields: [orders.billId],
  //   references: [bills.id],
  // }),
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
