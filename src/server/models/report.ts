import { and, count, eq, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { orders, bills } from "../db/schemas";
import { endOfToday, startOfToday } from "date-fns";

export const topSalesItems = async () => {
  return await db
    .select({
      count: count(),
    })
    .from(bills)
    .where(eq(bills.createdAt, new Date()));
};

export const totalCustomers = async () => {
  const [result] = await db
    .select({
      count: count(),
    })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, startOfToday()),
        lte(orders.createdAt, endOfToday()),
      ),
    );
  return result?.count ?? 0;
};

// export const topSoldItems = async () => {
//    const [items ] = await db.select().from(orderItems).where(eq())
// };
