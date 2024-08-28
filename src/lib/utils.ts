import type {
  Bill,
  NewOrderItem,
  OrderItem,
  Reservation,
} from "@/server/db/schemas";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount?: string | number | null,
  currency = "GBP",
  locale = "en-GB",
): string {
  if (!amount) return "";
  const amountNumber = Number(amount);
  if (isNaN(amountNumber)) return "";
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amountNumber);
}

export type ReservationTimeSlot = {
  startTime: string;
  finishTime: string;
  isAvailable: boolean;
};

type GenerateTimeSlots = {
  openTime: string;
  closeTime: string;
  duration: number;
  interval: number;
  date: string;
  reservations: Reservation[];
};
export function generateTimeSlots({
  openTime,
  closeTime,
  duration,
  interval,
  date,
  reservations,
}: GenerateTimeSlots) {
  const timeSlots: ReservationTimeSlot[] = [];

  const [openTimeHours, openTimeMinutes] = openTime.split(":").map(Number);
  const [closeTimeHours, closeTimeMinutes] = closeTime.split(":").map(Number);

  const openTimeTotalMinutes = openTimeHours! * 60 + openTimeMinutes!;
  const closeTimeTotalMinutes = closeTimeHours! * 60 + closeTimeMinutes!;

  for (
    let minutes = openTimeTotalMinutes;
    minutes + duration <= closeTimeTotalMinutes;
    minutes += interval
  ) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const start = new Date(new Date(date).setHours(hour, minute, 0));
    const finish = new Date(
      new Date(date).setHours(hour, minute + duration, 0),
    );
    const startTime = format(start, "HH:mm");
    const finishTime = format(finish, "HH:mm");

    const isAvailable = !reservations.some((reservation) => {
      return reservation.expireAt === finishTime;
    });

    timeSlots.push({ startTime, finishTime, isAvailable });
  }

  return timeSlots;
}

export const combineOrderItems = (
  items1: OrderItem[],
  items2: NewOrderItem[],
): OrderItem[] => {
  const combinedMap = new Map<string, OrderItem>();

  // Helper function to add items to the map
  const addToMap = (item: NewOrderItem) => {
    const key = `${item.orderId}-${item.itemId}`;
    if (combinedMap.has(key)) {
      const existingItem = combinedMap.get(key)!;
      existingItem.quantity =
        (existingItem.quantity ?? 0) + (item.quantity ?? 0);
    } else {
      combinedMap.set(key, { ...item, quantity: item.quantity ?? 0 });
    }
  };

  // Process both arrays
  items1.forEach(addToMap);
  items2.forEach(addToMap);

  // Convert map back to array
  return Array.from(combinedMap.values());
};

export function formatFieldName(fieldName: string) {
  return fieldName.replace(/([A-Z])/g, " $1").trim();
}

export type ItemToSummerize = {
  itemId: string;
  quantity: number;
  items: {
    name: string | null;
    price: number | null;
    imageUrl: string | null;
  };
};

export function formatId(id: number) {
  return id.slice(-4);
}

export const countTotal = (bill: Bill | null) => {
  if (!bill) return 0;
  let result = bill.totalAmount ?? 0;
  result += bill.serviceFee ?? 0;
  return result;
};
