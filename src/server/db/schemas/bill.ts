import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  real,
  unique,
  text,
} from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { orders } from "./order";
import { users } from "./user";

export const paymentMethod = ["Card", "Cash"] as const;

export const bills = sqliteTable(
  "bills",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => uuid()),
    totalAmount: real("total_amount").notNull(),
    serviceFee: real("service_fee"),
    tax: real("tax"),
    paid: integer("paid", { mode: "boolean" }).default(false),
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).$default(
      () => new Date(),
    ),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$default(
      () => new Date(),
    ),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
  },
  (t) => ({ unq: unique().on(t.userId, t.orderId) }),
);

export const payments = sqliteTable("payments", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuid()),

  billId: text("bill_id")
    .references(() => bills.id)
    .notNull(),
  paymentMethod: text("payment_method", { enum: paymentMethod }).notNull(),
  chargedAmount: real("charged_amount").notNull(),
  tipAmount: real("tip_amount"),
  userId: text("userId", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(CURRENT_DATE)`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(CURRENT_DATE)`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const billsRelations = relations(bills, ({ one, many }) => ({
  payments: many(payments),
  orders: one(orders, {
    fields: [bills.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [bills.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  bill: one(bills, {
    fields: [payments.billId],
    references: [bills.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export type Bill = typeof bills.$inferSelect;
export type NewBill = typeof bills.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type BillWithPayments = Bill & { payments: Payment[] };

export const billSchema = createSelectSchema(bills);
export const newBillSchema = createInsertSchema(bills);
export const paymentSchema = createSelectSchema(payments);
export const newPaymentSchema = createInsertSchema(payments);
