/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
DROP INDEX IF EXISTS `bills_user_id_order_id_unique`;--> statement-breakpoint
/*
 SQLite does not support "Changing existing column type" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `tables` ADD `userId` text(255) REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `orders` ADD `userId` text(255) REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `bills` ADD `userId` text(255) REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `payments` ADD `userId` text(255) NOT NULL REFERENCES user(id);--> statement-breakpoint
CREATE UNIQUE INDEX `bills_userId_order_id_unique` ON `bills` (`userId`,`order_id`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `tables` DROP COLUMN `selected_by`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `user_id`;--> statement-breakpoint
ALTER TABLE `bills` DROP COLUMN `user_id`;--> statement-breakpoint
ALTER TABLE `payments` DROP COLUMN `user_id`;