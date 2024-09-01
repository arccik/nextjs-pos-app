import { eq, lt, sql } from "drizzle-orm";
import { db } from "../db";
import {
  type Payment,
  payments,
  type NewPayment,
  orderItems,
  bills,
  orders,
  items,
} from "../db/schemas";

export const getOne = async (id: string) => {
  return await db.query.payments.findFirst({
    where: eq(payments.id, id),
  });
};
export const getByBillId = async (billId: string) => {
  return await db.query.payments.findMany({
    where: eq(payments.billId, billId),
    with: { user: { columns: { password: false, email: false } } },
  });
};

export const create = async (data: NewPayment) => {
  const [payment] = await db.insert(payments).values(data).returning();
  const bill = await db.query.bills.findFirst({
    where: eq(bills.id, data.billId),
    with: {
      payments: true,
    },
  });
  if (!payment || !bill) return;
  const totalPaid = bill.payments.reduce(
    (acc, curr) => acc + curr.chargedAmount,
    0,
  );
  const totalAmount = bill.totalAmount - totalPaid;
  // await db.update(bills).set({ totalAmount }).where(eq(bills.id, data.billId));

  if (totalAmount <= 0) {
    await db
      .update(orders)
      .set({ isPaid: true })
      .where(eq(orders.id, data.orderId));
    await db.update(bills).set({ paid: true }).where(eq(bills.id, data.billId));
  }

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

export const totalSales = async () => {
  const today = new Date();
  const response = await db.query.payments.findMany({
    where: lt(payments.createdAt, today),
  });
  const result = response.reduce((acc, curr) => acc + curr.chargedAmount, 0);
  return result?.toFixed(2);
};

export const totalSoldItems = async () => {
  const today = new Date();
  const response = await db.query.orderItems.findMany({
    where: lt(orderItems.createdAt, today),
  });
  const result = response.reduce((acc, curr) => acc + curr.quantity, 0);
  return result;
};

export const mostSoldItems = async () => {
  // const today = startOfMonth(new Date());
  const result = await db
    .select({
      itemId: orderItems.itemId,
      totalQuantity: sql<number>`SUM(quantity)`.as("totalQuantity"),
      item: items,
    })
    .from(orderItems)
    .groupBy(orderItems.itemId, items.id)
    .leftJoin(items, eq(orderItems.itemId, items.id))
    .limit(6);
  // .where(lt(orderItems.createdAt, today))
  return result;
  // const response = await db.query.orderItems.findMany({
  //   where: lt(orderItems.createdAt, today),
  // });
};

export async function getMonthlyPaymentTotals() {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const result = await db
    .select({
      month: sql<number>`EXTRACT(MONTH FROM ${payments.createdAt})`,
      total: sql<number>`SUM(${payments.chargedAmount})`,
    })
    .from(payments)
    .groupBy(sql`EXTRACT(MONTH FROM ${payments.createdAt})`)
    .orderBy(sql`EXTRACT(MONTH FROM ${payments.createdAt})`);

  if (result.length === 0) {
    throw new Error("No payments found");
  }

  const monthlyTotals = monthNames.map((name, index) => {
    const monthData = result.find((r) => r.month == index + 1);
    return {
      name,
      total: monthData ? Math.floor(monthData.total) : 0,
    };
  });

  return monthlyTotals;
}
