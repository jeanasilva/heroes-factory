CREATE TABLE `heroes` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `nickname` VARCHAR(80) NOT NULL,
  `date_of_birth` DATETIME(3) NOT NULL,
  `universe` VARCHAR(80) NOT NULL,
  `main_power` VARCHAR(120) NOT NULL,
  `avatar_url` VARCHAR(2048) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  INDEX `heroes_created_at_idx` (`created_at`),
  INDEX `heroes_name_idx` (`name`),
  INDEX `heroes_nickname_idx` (`nickname`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
