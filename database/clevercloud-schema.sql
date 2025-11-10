-- CleverCloud MySQL Schema (without CREATE DATABASE)

-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS `Documents`;
DROP TABLE IF EXISTS `Appointments`;
DROP TABLE IF EXISTS `Properties`;
DROP TABLE IF EXISTS `Clients`;
DROP TABLE IF EXISTS `Users`;

-- Users table
CREATE TABLE IF NOT EXISTS `Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(200) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'agent') DEFAULT 'agent' NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clients table
CREATE TABLE IF NOT EXISTS `Clients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  `nationality` VARCHAR(100),
  `passport_number` VARCHAR(100),
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Properties table
CREATE TABLE IF NOT EXISTS `Properties` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `address` TEXT,
  `city` VARCHAR(100),
  `price` DECIMAL(15, 2),
  `description` TEXT,
  `status` ENUM('available', 'sold', 'rented', 'pending') DEFAULT 'available',
  `clientId` INT,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`clientId`) REFERENCES `Clients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `status_index` (`status`),
  INDEX `client_index` (`clientId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Appointments table
CREATE TABLE IF NOT EXISTS `Appointments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NOT NULL,
  `status` ENUM('scheduled', 'completed', 'cancelled', 'rescheduled') DEFAULT 'scheduled',
  `clientId` INT,
  `propertyId` INT,
  `agentId` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`clientId`) REFERENCES `Clients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`propertyId`) REFERENCES `Properties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`agentId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `status_index` (`status`),
  INDEX `start_date_index` (`startDate`),
  INDEX `client_index` (`clientId`),
  INDEX `property_index` (`propertyId`),
  INDEX `agent_index` (`agentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Documents table
CREATE TABLE IF NOT EXISTS `Documents` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  `originalName` VARCHAR(255) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `appointmentId` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`appointmentId`) REFERENCES `Appointments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `appointment_index` (`appointmentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
