import { relations } from "drizzle-orm";
import {
  pgTable,
  real,
  unique,
  boolean,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { orders } from "./order";
import { users } from "./user";

export const paymentMethod = ["Card", "Cash"] as const;

export const bills = pgTable(
  "bills",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    totalAmount: real("total_amount").notNull(),
    serviceFee: real("service_fee"),
    tax: real("tax"),
    paid: boolean("paid").default(false),
    tipAmount: real("tip_amount"),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
    orderId: varchar("order_id", { length: 255 }).notNull(),
  },
  (t) => ({ unq: unique().on(t.userId, t.orderId) }),
);

export const payments = pgTable("payments", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  billId: varchar("bill_id", { length: 255 })
    .references(() => bills.id)
    .notNull(),
  paymentMethod: varchar("payment_method", { enum: paymentMethod }).notNull(),
  chargedAmount: real("charged_amount").notNull(),
  tipAmount: real("tip_amount"),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
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
