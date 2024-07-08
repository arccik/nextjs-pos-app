CREATE TABLE `account` (
	`userId` text(255) NOT NULL,
	`type` text(255) NOT NULL,
	`provider` text(255) NOT NULL,
	`providerAccountId` text(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text(255),
	`scope` text(255),
	`id_token` text,
	`session_state` text(255),
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`createdById` text(255) NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`createdById`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image` text,
	`phone` text,
	`address` text,
	`user_id` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`image` text,
	`emailVerified` integer DEFAULT CURRENT_TIMESTAMP,
	`role` text DEFAULT 'user' NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text(255) NOT NULL,
	`token` text(255) NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
--> statement-breakpoint
CREATE TABLE `tables` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`number` integer NOT NULL,
	`prefix` text(5),
	`description` text,
	`seats` integer NOT NULL,
	`require_cleaning` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`created_at` integer DEFAULT (CURRENT_DATE),
	`updated_at` integer DEFAULT (CURRENT_DATE)
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`table_id` integer,
	`customer_name` text NOT NULL,
	`customer_phone_number` text,
	`customer_email` text,
	`guest_predicted_number` integer,
	`special_requests` text,
	`notes` text,
	`status` text DEFAULT 'Scheduled' NOT NULL,
	`scheduled_at` text(255) NOT NULL,
	`expire_at` text(255) NOT NULL,
	`created_at` integer DEFAULT (CURRENT_DATE),
	FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `allergens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255),
	`created_at` integer DEFAULT (CURRENT_DATE)
);
--> statement-breakpoint
CREATE TABLE `nutrition` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`calories` real,
	`carbohydrates` real,
	`proteins` real,
	`fat` real
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`order_id` integer NOT NULL,
	`item_id` integer NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	PRIMARY KEY(`item_id`, `order_id`),
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`table_id` integer,
	`is_paid` integer DEFAULT false NOT NULL,
	`order_status` text DEFAULT 'In Progress' NOT NULL,
	`special_request` text,
	`bill_id` integer,
	`created_at` integer DEFAULT (CURRENT_DATE),
	`updated_at` integer DEFAULT (CURRENT_DATE),
	FOREIGN KEY (`table_id`) REFERENCES `tables`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`image_url` text(255),
	`vegetarian` integer,
	`vegan` integer,
	`gluten_free` integer,
	`spicy` integer,
	`preparation_time` integer NOT NULL,
	`category_id` integer,
	`created_at` integer DEFAULT (CURRENT_DATE),
	`available` integer DEFAULT true,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`nutrition_id` integer,
	FOREIGN KEY (`nutrition_id`) REFERENCES `nutrition`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `store_custom_working_times` (
	`date` integer DEFAULT (CURRENT_DATE),
	`name` text NOT NULL,
	`open_time` text,
	`close_time` text,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `store_regular_working_times` (
	`number` integer PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`open_time` text,
	`close_time` text,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `store_settings` (
	`profile_name` text PRIMARY KEY DEFAULT 'default' NOT NULL,
	`store_force_close` integer DEFAULT false NOT NULL,
	`reservation_interval` integer,
	`reservation_duration` integer,
	`reservation_not_arrival_expiration_time` integer,
	`table_leading_zeros` integer DEFAULT false NOT NULL,
	`leading_zeros_quantity` integer DEFAULT 1 NOT NULL,
	`service_fee` real
);
--> statement-breakpoint
CREATE TABLE `bills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`total_amount` real NOT NULL,
	`service_fee` real,
	`tax` real,
	`paid` integer DEFAULT false,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT (CURRENT_DATE),
	`updated_at` integer DEFAULT (CURRENT_DATE),
	`order_id` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bill_id` integer NOT NULL,
	`payment_method` text NOT NULL,
	`charged_amount` real NOT NULL,
	`tip_amount` real,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT (CURRENT_DATE),
	`updated_at` integer DEFAULT (CURRENT_DATE),
	FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `venue_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`phone` text,
	`email` text,
	`website` text,
	`manager_name` text,
	`description` text,
	`capacity` integer,
	`amenities` text,
	`accessibility_information` text,
	`logo` text,
	`accept_cash` integer,
	`accept_credit` integer,
	`accept_mobile_payment` integer,
	`allow_manager_to_edit_menu` integer,
	`allowed_cashier_to_refund` integer,
	`allowed_servers_to_modify_order` integer,
	`service_fee` integer,
	`created_at` integer DEFAULT (CURRENT_DATE),
	`updated_at` integer DEFAULT (CURRENT_DATE)
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`userId`);--> statement-breakpoint
CREATE INDEX `createdById_idx` ON `post` (`createdById`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `post` (`name`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `tables_number_prefix_unique` ON `tables` (`number`,`prefix`);--> statement-breakpoint
CREATE UNIQUE INDEX `bills_user_id_order_id_unique` ON `bills` (`user_id`,`order_id`);