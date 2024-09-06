"use server";

import { gte, sum } from "drizzle-orm";
import { db } from "@/server/db";
import { bills } from "@/server/db/schemas";
import { subDays } from "date-fns";

export const paidThisWeek = async () => {
  const [result] = await db
    .select({
      totalAmountSum: sum(bills.totalAmount),
    })
    .from(bills)
    .where(gte(bills.createdAt, subDays(new Date(), 7)));

  return result?.totalAmountSum || 0;
};

export const paidThisMonth = async () => {
  const [result] = await db
    .select({
      totalAmountSum: sum(bills.totalAmount),
    })
    .from(bills)
    .where(gte(bills.createdAt, subDays(new Date(), 30)));

  return result?.totalAmountSum || 0;
};
