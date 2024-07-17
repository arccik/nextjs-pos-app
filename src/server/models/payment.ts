import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  type Payment,
  payments,
  NewPayment,
  orders,
  bills,
} from "../db/schemas";

export const create = async (data: NewPayment) => {
  try {
    const payment = await db.insert(payments).values(data).returning();
    await db
      .update(orders)
      .set({ isPaid: true })
      .where(eq(orders.billId, data.billId));
    await db.update(bills).set({ paid: true }).where(eq(bills.id, data.billId));
    return payment;
  } catch (error) {
    console.log(error);
    return { error: "[db:createPayment] Went wrong.." };
  }
};

export const deleteOne = async (id: string) => {
  try {
    return await db.delete(payments).where(eq(payments.id, id));
  } catch (error) {
    console.log(error);
    return { error: "[db:deletePayment] Went wrong.." };
  }
};
export const update = async (body: Payment) => {
  try {
    return await db
      .update(payments)
      .set(body)
      .where(eq(payments.id, body.id))
      .returning();
  } catch (error) {
    console.error(error);
    return { error: "[db:updatePayment] Went wrong.." };
  }
};
