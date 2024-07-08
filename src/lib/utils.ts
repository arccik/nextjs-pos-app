import {
  Item,
  NewOrderItem,
  Order,
  OrderItem,
  Reservation,
  Table,
  User,
} from "@/server/db/schemas";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export function formatCurrency(
  amount?: string | number | null,
  currency: string = "GBP",
  locale: string = "en-GB",
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

interface CombinedOrder {
  orderId: number;
  tableId: number | null;
  status: string;
  itemId: number;
  user: string | null;
  createdAt: Date | null | string;
  table: number | null;
  items: { name: string; quantity: number; id: number }[];
}
export type OrderItemsWithOrderAndItems = {
  orders: Order;
  items: Item;
  order_items: OrderItem;
  users: User;
  tables: Table;
};

export function combinedOrders(
  data: OrderItemsWithOrderAndItems[],
): CombinedOrder[] {
  const combinedOrderMap: { [orderId: number]: CombinedOrder } = {};

  data.forEach((orderData) => {
    const { orders, order_items, items } = orderData;
    const { orderId, itemId, quantity } = order_items;

    if (!combinedOrderMap[orderId]) {
      combinedOrderMap[orderId] = {
        orderId,
        itemId,
        createdAt: orders.createdAt,
        table: orderData.tables?.number,
        user: orderData.users?.name,
        tableId: orders.tableId,
        status: orders.status,
        items: [],
      };
    }

    combinedOrderMap[orderId]?.items.push({
      name: items.name,
      quantity,
      id: items.id,
    });
  });

  return Object.values(combinedOrderMap);
}

type ItemWithQuantity = Item & { quantity: number };

export const combineItems = (items: Item[]) =>
  items.reduce((acc, item) => {
    const existing = acc.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, [] as ItemWithQuantity[]);

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
        (existingItem.quantity || 0) + (item.quantity || 0);
    } else {
      combinedMap.set(key, { ...item, quantity: item.quantity || 0 });
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
