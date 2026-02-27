import Dexie, { type Table } from "dexie";

// --- Types mirroring Drizzle select schemas ---

export interface LocalOrder {
  id: string;
  userId: string;
  selectedBy: string | null;
  tableId: string | null;
  isPaid: boolean;
  status: "Pending" | "Ready" | "In Progress" | "Completed" | "Cancelled" | "Served";
  guestLeft: boolean;
  specialRequest: string | null;
  billId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LocalOrderItem {
  orderId: string;
  itemId: string;
  quantity: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LocalRestaurantTable {
  id: string;
  number: number;
  prefix: string | null;
  description: string | null;
  seats: number;
  selectedBy: string | null;
  requireCleaning: boolean;
  status: "available" | "occupied" | "reserved" | "closed";
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LocalItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isVegetarian: boolean | null;
  isVegan: boolean | null;
  isGlutenFree: boolean | null;
  isSpicy: boolean | null;
  preparationTime: number;
  categoryId: string;
  isAvailable: boolean | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LocalCategory {
  id: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LocalBill {
  id: string;
  totalAmount: number;
  serviceFee: number | null;
  tax: number | null;
  paid: boolean | null;
  tipAmount: number | null;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LocalPayment {
  id: string;
  billId: string;
  paymentMethod: "Card" | "Cash";
  chargedAmount: number;
  tipAmount: number | null;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  orderId: string;
  idempotencyKey?: string;
}

export interface SyncQueueEntry {
  id: string;
  trpcPath: string;
  input: unknown;
  createdAt: number;
  status: "pending" | "processing" | "failed";
  retryCount: number;
}

// --- Dexie database ---

export class PosDatabase extends Dexie {
  orders!: Table<LocalOrder>;
  orderItems!: Table<LocalOrderItem>;
  // Named "restaurantTables" to avoid collision with Dexie's own "tables" property
  restaurantTables!: Table<LocalRestaurantTable>;
  items!: Table<LocalItem>;
  categories!: Table<LocalCategory>;
  bills!: Table<LocalBill>;
  payments!: Table<LocalPayment>;
  syncQueue!: Table<SyncQueueEntry>;

  constructor() {
    super("pos-local-db");
    this.version(1).stores({
      orders: "id, tableId, status, billId, userId",
      orderItems: "[orderId+itemId], orderId, itemId",
      // Store name is "restaurantTables" matching the property
      restaurantTables: "id, status, number",
      items: "id, categoryId, isAvailable",
      categories: "id, name",
      bills: "id, userId, paid",
      payments: "id, billId, orderId, idempotencyKey",
      syncQueue: "id, status, createdAt",
    });
  }
}

export const db = new PosDatabase();
