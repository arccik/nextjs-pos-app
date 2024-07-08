import { and, count, eq, gte, lte } from "drizzle-orm";
import { db } from "..";
import { orders, bills, orderItems } from "../schemas";
import {
  startOfDay,
  endOfDay,
  format,
  endOfToday,
  startOfToday,
} from "date-fns";

export const topSalesItems = async () => {
  try {
    return await db
      .select({
        count: count(),
      })
      .from(bills)
      .where(eq(bills.createdAt, new Date()));
  } catch (error) {
    console.log(error);
    return { error: "[db:topSalesItems] Went wrong.." };
  }
};

export const totalCustomers = async () => {
  try {
    // const today = new Date();
    // const todayStart =
    //   format(startOfDay(today), "yyyy-MM-dd") + "T00:00:00.000Z";
    // const todayEnd = format(endOfDay(today), "yyyy-MM-dd") + "T23:59:59.999Z";
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
  } catch (error) {
    console.log(error);
    return { error: "[db:totalCustomers] Went wrong.." };
  }
};

export const topSoldItems = async () => {
  try {
    // const [items ] = await db.select().from(orderItems).where(eq())
  } catch (error) {
    console.log(error);
    return { error: "[db:topSoldItems] Went wrong.." };
  }
};
