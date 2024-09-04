import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { users } from "./user";

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  message: varchar("message", { length: 255 }).notNull(),
  type: varchar("type", { length: 255, enum: ["info", "warning", "error"] })
    .default("info")
    .notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const notificationRelations = relations(notifications, ({ one }) => ({
  user: one(users),
}));

export const newNotificationSchema = createInsertSchema(notifications);
export const notificationSchema = createSelectSchema(notifications);
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
