import {
  text,
  integer,
  primaryKey,
  int,
  index,
  sqliteTable,
} from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type AdapterAccount } from "next-auth/adapters";
import { tables } from "./table";
import { z } from "zod";

export const userRoles = [
  "admin",
  "user",
  "waiter",
  "chef",
  "manager",
] as const;

export const users = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuid()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  image: text("image"),
  emailVerified: int("emailVerified", {
    mode: "timestamp",
  }).default(sql`CURRENT_TIMESTAMP`),
  role: text("role", { enum: userRoles }).notNull().default("user"),
  // updatedAt: int("updated_at", { mode: "timestamp" })
  //   .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
  //   .default(sql`CURRENT_TIMESTAMP`)
  //   .notNull(),

  // createdAt: int("created_at", { mode: "timestamp" })
  //   .default(sql`CURRENT_TIMESTAMP`)
  //   .notNull(),
  updatedAt: text("timestamp").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  createdAt: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profileInfo: one(profileInfo),
  accounts: many(accounts),
  tables: many(tables),
}));

export const profileInfo = sqliteTable("profile", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => uuid()),
  image: text("image"),
  phone: text("phone"),
  address: text("address"),
  userId: text("user_id").references(() => users.id),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const profileInfoRelations = relations(profileInfo, ({ one }) => ({
  user: one(users, {
    fields: [profileInfo.userId],
    references: [users.id],
  }),
}));

// export const posts = sqliteTable(
//   "post",
//   {
//     id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
//     name: text("name", { length: 256 }),
//     createdById: text("createdById", { length: 255 })
//       .notNull()
//       .references(() => users.id),
//     createdAt: int("created_at", { mode: "timestamp" })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: int("updatedAt", { mode: "timestamp" }),
//   },
//   (example) => ({
//     createdByIdIdx: index("createdById_idx").on(example.createdById),
//     nameIndex: index("name_idx").on(example.name),
//   }),
// );

// export const users = sqliteTable("user", {
//   id: text("id", { length: 255 })
//     .notNull()
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   name: text("name", { length: 255 }),
//   email: text("email", { length: 255 }).notNull(),
//   emailVerified: int("emailVerified", {
//     mode: "timestamp",
//   }).default(sql`CURRENT_TIMESTAMP`),
//   image: text("image", { length: 255 }),
// });

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = sqliteTable(
  "session",
  {
    sessionToken: text("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: int("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
export const updateUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  image: z.string().optional(),
  role: z.enum(["admin", "user", "waiter", "chef", "manager"]),
  password: z.string().optional(),
});
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type User = typeof users.$inferSelect;
// export type NewUser = typeof users.$inferInsert;
export type NewUser = z.infer<typeof newUserSchema>;



export const userSchema = createSelectSchema(users);
export const newUserSchema = createInsertSchema(users);
