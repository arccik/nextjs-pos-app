import { and, eq, gt, gte, lt } from "drizzle-orm";

import { NewBill, bills, orders } from "../schemas";
import { getOne as getOneOrder } from "./order";
import { subDays } from "date-fns";
import { db } from "..";

export const getOneByOrderId = async (orderId: number) => {
  try {
    // const bill = await db.select().from(bills).where(eq(bills.orderId, id));
    const bill = await db.query.bills.findFirst({
      where: eq(bills.orderId, orderId),
      with: { payments: true, user: { columns: { name: true, role: true } } },
    });
    return bill;
  } catch (error) {
    console.log(error);
    return { error: "[db:getOneBill] Went wrong.." };
  }
};
export const getAllPaid = async ({ paid }: { paid: boolean }) => {
  try {
    return await db.query.bills.findMany({
      where: eq(bills.paid, paid),
    });
  } catch (error) {
    console.log(error);
    return { error: "[db:getManyBills] Went wrong.." };
  }
};
export const getAll = async () => {
  try {
    return await db.query.bills.findMany({
      orderBy: (bills, { asc }) => [asc(bills.id)],
      with: { payments: true },
    });
    // return await db.query.bills.findMany({ with: { payments: true } });
  } catch (error) {
    console.log(error);
    return { error: "[db:getManyBills] Went wrong.." };
  }
};
export const update = async (data: NewBill) => {
  try {
    if (!data.id) return { error: "Bill id is required" };
    return await db
      .update(bills)
      .set(data)
      .where(eq(bills.id, data.id))
      .returning();
  } catch (error) {
    console.log(error);
    return { error: "[db:getManyBills] Went wrong.." };
  }
};

export const create = async (data: NewBill) => {
  try {
    const [billId] = await db.insert(bills).values(data).returning();
    if (!billId) return { error: "Bill id is required" };
    return await db
      .update(orders)
      .set({ billId: billId.id })
      .where(eq(orders.id, data.orderId));
  } catch (error) {
    console.log(error);
    return { error: "[db:createBill] Went wrong.." };
  }
};

export const deleteOne = async (id: number) => {
  try {
    const result = await db.delete(bills).where(eq(bills.id, id));
    return result;
  } catch (error) {
    console.log(error);
    return { error: "[db:deleteBill] Went wrong.." };
  }
};
export const generateBill = async (orderId: number, tipsAmount?: number) => {
  try {
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
    return await create({ orderId, totalAmount: total, userId: 1 });
  } catch (error) {
    console.error(error);
    return { error: "[db:generateBill] Went wrong.." };
  }
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
