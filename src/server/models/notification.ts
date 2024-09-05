import { eq, and } from "drizzle-orm";
import { db } from "../db";
import {
  notifications,
  type Notification,
  type NewNotification,
} from "../db/schemas";

// Create a new notification
export const createNotification = async (
  notification: Omit<NewNotification, "id">,
) => {
  return await db.insert(notifications).values(notification).returning();
};

// Get all notifications
export const getAllNotifications = async () => {
  return await db.query.notifications.findMany();
};

// Get notifications by user
export const getNotificationsByUser = async (userId: string) => {
  return await db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
  });
};

// Get unread notifications for a user
export const getUnreadNotifications = async (userId: string) => {
  return await db.query.notifications.findMany({
    where: and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false),
    ),
  });
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  return await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId))
    .returning();
};

// Update notification
export const updateNotification = async (
  id: string,
  data: Partial<Notification>,
) => {
  return await db
    .update(notifications)
    .set(data)
    .where(eq(notifications.id, id))
    .returning();
};

// Delete notification
export const deleteNotification = async (id: string) => {
  return await db
    .delete(notifications)
    .where(eq(notifications.id, id))
    .returning();
};
