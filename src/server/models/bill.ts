import { eq, gte } from "drizzle-orm";

import { NewBill, NewPayment, bills, orders, payments } from "../db/schemas";
import { getOne as getOneOrder } from "./order";
import { subDays } from "date-fns";
import { db } from "../db";

export const getOneById = async (billId: string) => {
  return await db.query.bills.findFirst({
    where: eq(bills.id, billId),
    with: { payments: true, user: { columns: { name: true, role: true } } },
  });
};
 
export const getOneByOrderId = async (orderId: string) => {
  return await db.query.bills.findFirst({
    where: eq(bills.orderId, orderId),
    with: { payments: true, user: { columns: { name: true, role: true } } },
  });
};
export const getAllPaid = async ({ paid }: { paid: boolean }) => {
  return await db.query.bills.findMany({
    where: eq(bills.paid, paid),
  });
};
export const getAll = async () => {
  return await db.query.bills.findMany({
    orderBy: (bills, { asc }) => [asc(bills.id)],
    with: { payments: true },
  });
};
export const update = async (data: NewBill) => {
  if (!data.id) return { error: "Bill id is required" };
  return await db
    .update(bills)
    .set(data)
    .where(eq(bills.id, data.id))
    .returning();
};

export const create = async (data: NewBill) => {
  const [billId] = await db.insert(bills).values(data).returning();
  if (!billId) return { error: "Bill id is required" };
  return await db
    .update(orders)
    .set({ billId: billId.id })
    .where(eq(orders.id, data.orderId));
};

export const deleteOne = async (id: string) => {
  return await db.delete(bills).where(eq(bills.id, id));
};
export const generateBill = async (
  orderId: string,
  tipsAmount?: number | null,
) => {
  const order = await getOneOrder(orderId);
  if (!order || !("orderItems" in order)) return { error: "Order not found" };

  const tipsAmountNumber = tipsAmount ? tipsAmount : 0;
  let totalAmount = 0;
  for (const orderItem of order.orderItems) {
    totalAmount += orderItem.quantity * Number(orderItem.items.price);
  }
  const total = totalAmount + tipsAmountNumber;
  if (order.billId) {
    return await db
      .update(bills)
      .set({ totalAmount })
      .where(eq(bills.id, order.billId))
      .returning();
  }
  return await create({ orderId, totalAmount: total, userId: "1" });
};

export const updateBill = async ({
  orderId,
  userId,
  tipsAmount,
}: {
  orderId: string;
  userId: string;
  tipsAmount?: number;
}) => {
  const order = await getOneOrder(orderId);
  if (!order || !("orderItems" in order)) return { error: "Order not found" };

  let totalAmount = tipsAmount ? tipsAmount : 0;
  for (const orderItem of order.orderItems) {
    totalAmount += orderItem.quantity * Number(orderItem.items.price);
  }
  const bill = await getOneByOrderId(orderId);
  if (bill) {
    return await db
      .update(bills)
      .set({ totalAmount })
      .where(eq(bills.id, bill.id))
      .returning();
  }
  return await db
    .insert(bills)
    .values({ totalAmount, orderId, userId })
    .returning();
};

export const paidThisWeek = async () => {
  const today = new Date();
  const result = await db
    .select()
    .from(bills)
    .where(gte(bills.createdAt, subDays(today, 7)));
  return (
    result &&
    result
      .reduce((acc, cur) => {
        return acc + Number(cur.totalAmount);
      }, 0)
      .toFixed(2)
  );
};

export const paidThisMonth = async () => {
  const today = new Date();
  const result = await db
    .select()
    .from(bills)
    .where(gte(bills.createdAt, subDays(today, 30)));
  return result
    .reduce((acc, cur) => {
      return acc + Number(cur.totalAmount);
    }, 0)
    .toFixed(2);
};

export const payBill = async (data: NewPayment) => {
  const payment = await db.insert(payments).values(data).returning();
  await db
    .update(orders)
    .set({ isPaid: true })
    .where(eq(orders.billId, data.billId));
  await db.update(bills).set({ paid: true }).where(eq(bills.id, data.billId));
  return payment;
};
