import type { Server } from "socket.io";

function getSocketIo(): Server | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as Record<string, unknown>).socketIo as Server | null ?? null;
}

export function emitOrderUpdate(orderId: string, data?: Record<string, unknown>): void {
  getSocketIo()?.to("restaurant").emit("order:updated", { orderId, ...data });
}

export function emitTableUpdate(tableId: string, data?: Record<string, unknown>): void {
  getSocketIo()?.to("restaurant").emit("table:updated", { tableId, ...data });
}

export function emitPaymentCreated(billId: string, data?: Record<string, unknown>): void {
  getSocketIo()?.to("restaurant").emit("payment:created", { billId, ...data });
}
