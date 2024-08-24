import { eq } from "drizzle-orm";
import { db } from "../db";
import { type Payment, payments, type NewPayment } from "../db/schemas";

export const getOne = async (id: string) => {
  return await db.query.payments.findFirst({
    where: eq(payments.id, id),
  });
};
export const getByBillId = async (billId: string) => {
  return await db.query.payments.findMany({
    where: eq(payments.billId, billId),
  });
};

export const create = async (data: NewPayment) => {
  const payment = await db.insert(payments).values(data).returning();
  // await db
  //   .update(orders)
  //   .set({ isPaid: true })
  //   .where(eq(orders.billId, data.billId));
  // await db.update(bills).set({ paid: true }).where(eq(bills.id, data.billId));
  return payment;
};

export const deleteOne = async (id: string) => {
  return await db.delete(payments).where(eq(payments.id, id));
};
export const update = async (body: Payment) => {
  return await db
    .update(payments)
    .set(body)
    .where(eq(payments.id, body.id))
    .returning();
};
