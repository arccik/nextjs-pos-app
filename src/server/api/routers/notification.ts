import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  createNotification,
  getAllNotifications,
  getNotificationsByUser,
  getUnreadNotifications,
  markNotificationAsRead,
  updateNotification,
  deleteNotification,
} from "@/server/models/notification";
import { newNotificationSchema, notificationSchema } from "@/server/db/schemas";

export const notificationRouter = createTRPCRouter({
  // Create a new notification
  createNotification: protectedProcedure
    .input(newNotificationSchema)
    .mutation(async ({ input }) => {
      return await createNotification(input);
    }),

  // Get all notifications
  getAllNotifications: protectedProcedure.query(async () => {
    return await getAllNotifications();
  }),

  // Get notifications by user
  getNotificationsByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await getNotificationsByUser(input.userId);
    }),

  // Get unread notifications for a user
  getUnreadNotifications: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await getUnreadNotifications(input.userId);
    }),

  // Mark notification as read
  markNotificationAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ input }) => {
      return await markNotificationAsRead(input.notificationId);
    }),

  // Update notification
  updateNotification: protectedProcedure
    .input(
      notificationSchema.omit({
        createdAt: true,
        updatedAt: true,
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await updateNotification(id, data);
    }),

  // Delete notification
  deleteNotification: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteNotification(input.id);
    }),
});
