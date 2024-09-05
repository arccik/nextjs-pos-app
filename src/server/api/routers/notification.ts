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
  create: protectedProcedure
    .input(newNotificationSchema)
    .mutation(async ({ input }) => {
      return await createNotification(input);
    }),

  // Get all notifications
  getAll: protectedProcedure.query(async () => {
    return await getAllNotifications();
  }),

  // Get notifications by user
  getOneByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await getNotificationsByUser(input.userId);
    }),

  // Get unread notifications for a user
  getUnread: protectedProcedure.query(async ({ ctx }) => {
    return await getUnreadNotifications(ctx.session.user.id);
  }),

  // Mark notification as read
  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await markNotificationAsRead(input.id);
    }),

  // Update notification
  update: protectedProcedure
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
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteNotification(input.id);
    }),
});
