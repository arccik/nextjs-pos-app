import { eq, gte } from "drizzle-orm";
import {
  type NewBill,
  type NewPayment,
  bills,
  orders,
  payments,
} from "../db/schemas";
import { getOne as getOneOrder } from "./order";
import { subDays } from "date-fns";
import { db } from "../db";

export const getOneById = async (billId: string) => {
  return await db.query.bills.findFirst({
    where: eq(bills.id, billId),
    with: {
      payments: true,
      user: { columns: { name: true, role: true } },
      order: true,
    },
  });
};

export const getOneByOrderId = async (orderId: string) => {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      bill: true,
      creator: { columns: { name: true, role: true } },
    },
  });
  return order?.bill;
};

export const getAllPaid = async ({ paid }: { paid: boolean }) => {
  return await db.query.bills.findMany({
    where: eq(bills.paid, paid),
    with: { order: true },
  });
};

export const getAll = async () => {
  return await db.query.bills.findMany({
    orderBy: (bills, { asc }) => [asc(bills.id)],
    with: { payments: true, order: true },
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
  return await db.insert(bills).values(data).returning();
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

  const tipsAmountNumber = tipsAmount ?? 0;
  let totalAmount = 0;
  for (const orderItem of order.orderItems) {
    totalAmount += orderItem.quantity * Number(orderItem.items.price);
  }
  const total = totalAmount + tipsAmountNumber;

  const existingBill = await getOneByOrderId(orderId);
  if (existingBill) {
    return await db
      .update(bills)
      .set({ totalAmount: total, tipAmount: tipsAmountNumber })
      .where(eq(bills.id, existingBill.id))
      .returning();
  }

  return await create({
    totalAmount: total,
    userId: order.userId,
    tipAmount: tipsAmountNumber,
  });
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
  if (!order || !("orderItems" in order)) throw new Error("Order not found");

  let totalAmount = tipsAmount ?? 0;
  for (const orderItem of order.orderItems) {
    totalAmount += orderItem.quantity * orderItem.items.price;
  }

  const existingBill = await getOneByOrderId(orderId);
  if (existingBill) {
    return await db
      .update(bills)
      .set({ totalAmount, tipAmount: tipsAmount })
      .where(eq(bills.id, existingBill.id))
      .returning();
  }

  return await create({
    totalAmount,
    userId,
    tipAmount: tipsAmount,
  });
};

export const paidThisWeek = async () => {
  const today = new Date();
  const result = await db
    .select()
    .from(bills)
    .where(gte(bills.createdAt, subDays(today, 7)));
  if (!result) return;
  return result
    .reduce((acc, cur) => {
      return acc + Number(cur.totalAmount);
    }, 0)
    .toFixed(2);
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
  const [order] = await db
    .update(orders)
    .set({ isPaid: true })
    .where(eq(orders.id, data.orderId))
    .returning({ billId: orders.billId });
  if (!order?.billId) throw new Error("Order has no bill");
  await db.update(bills).set({ paid: true }).where(eq(bills.id, order.billId));
  return payment;
};

export const addTips = async (billId: string, tipAmount: number) => {
  const [bill] = await db.select().from(bills).where(eq(bills.id, billId));
  if (!bill) throw new Error("Bill not found");
  return await db
    .update(bills)
    .set({ tipAmount })
    .where(eq(bills.id, billId))
    .returning();
};
