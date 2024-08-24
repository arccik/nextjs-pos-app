"use server";

import { gte } from "drizzle-orm";
import { db } from "@/server/db";
import { bills } from "@/server/db/schemas";
import { subDays } from "date-fns";

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
