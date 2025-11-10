

  `id` INT NOT NULL AUTO_INCREMENT,

CREATE DATABASE IF NOT EXISTS calendar_db;  `title` VARCHAR(255) NOT NULL,

USE calendar_db;  `description` TEXT,

  `startDate` DATETIME NOT NULL,


CREATE TABLE IF NOT EXISTS `Users` () ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  `id` INT NOT NULL AUTO_INCREMENT,

  `full_name` VARCHAR(200) NOT NULL,

  `email` VARCHAR(255) NOT NULL UNIQUE,CREATE TABLE IF NOT EXISTS `Documents` (

  `password_hash` VARCHAR(255) NOT NULL,  `id` INT NOT NULL AUTO_INCREMENT,

  `role` ENUM('admin', 'agent') DEFAULT 'agent' NOT NULL,  `filename` VARCHAR(255) NOT NULL,

  `is_active` BOOLEAN DEFAULT TRUE NOT NULL,  `originalName` VARCHAR(255) NOT NULL,

  `createdAt` DATETIME NOT NULL,  `path` VARCHAR(255) NOT NULL,

  `updatedAt` DATETIME NOT NULL,  `appointmentId` INT NOT NULL,

  PRIMARY KEY (`id`),  `createdAt` DATETIME NOT NULL,

  UNIQUE KEY `idx_user_email` (`email`),  `updatedAt` DATETIME NOT NULL,

  KEY `idx_user_role` (`role`),  PRIMARY KEY (`id`),

  KEY `idx_user_active` (`is_active`)  KEY `appointmentId` (`appointmentId`),

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;  CONSTRAINT `Documents_ibfk_1` FOREIGN KEY (`appointmentId`) 

    REFERENCES `Appointments` (`id`) 

CREATE TABLE IF NOT EXISTS `Clients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(20),
  `nationality` VARCHAR(100),
  `passport_number` VARCHAR(50) UNIQUE,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_client_email` (`email`),
  UNIQUE KEY `idx_client_passport` (`passport_number`),
  KEY `idx_client_nationality` (`nationality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `Properties` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `address` VARCHAR(500) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `price` DECIMAL(12, 2) NOT NULL,
  `description` TEXT,
  `status` ENUM('available', 'reserved', 'sold') DEFAULT 'available' NOT NULL,
  `clientId` INT,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_property_city` (`city`),
  KEY `idx_property_status` (`status`),
  KEY `idx_property_price` (`price`),
  KEY `idx_property_client` (`clientId`),
  CONSTRAINT `Properties_ibfk_client` FOREIGN KEY (`clientId`) 
    REFERENCES `Clients` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Appointments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NOT NULL,
  `status` ENUM('scheduled', 'confirmed', 'completed', 'cancelled') DEFAULT 'scheduled' NOT NULL,
  `notes` TEXT,
  `clientId` INT,
  `propertyId` INT,
  `assignedUserId` INT,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_appointment_start_date` (`startDate`),
  KEY `idx_appointment_end_date` (`endDate`),
  KEY `idx_appointment_date_range` (`startDate`, `endDate`),
  KEY `idx_appointment_status` (`status`),
  KEY `idx_appointment_client` (`clientId`),
  KEY `idx_appointment_property` (`propertyId`),
  KEY `idx_appointment_user` (`assignedUserId`),
  CONSTRAINT `Appointments_ibfk_client` FOREIGN KEY (`clientId`) 
    REFERENCES `Clients` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
  CONSTRAINT `Appointments_ibfk_property` FOREIGN KEY (`propertyId`) 
    REFERENCES `Properties` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
  CONSTRAINT `Appointments_ibfk_user` FOREIGN KEY (`assignedUserId`) 
    REFERENCES `Users` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS `Documents` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  `originalName` VARCHAR(255) NOT NULL,
  `path` VARCHAR(255) NOT NULL,
  `type` ENUM('passport', 'visa', 'contract', 'financial', 'property_deed', 'other') DEFAULT 'other' NOT NULL,
  `clientId` INT,
  `appointmentId` INT,
  `uploadedBy` INT,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_document_client` (`clientId`),
  KEY `idx_document_type` (`type`),
  KEY `idx_document_uploaded_by` (`uploadedBy`),
  KEY `appointmentId` (`appointmentId`),
  CONSTRAINT `Documents_ibfk_client` FOREIGN KEY (`clientId`) 
    REFERENCES `Clients` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `Documents_ibfk_appointment` FOREIGN KEY (`appointmentId`) 
    REFERENCES `Appointments` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `Documents_ibfk_uploader` FOREIGN KEY (`uploadedBy`) 
    REFERENCES `Users` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `Users` (`full_name`, `email`, `password_hash`, `role`, `is_active`, `createdAt`, `updatedAt`)
VALUES 
  ('System Administrator', 'admin@goldenvisa.gr', '$2a$10$rW767ON2TLlhpBvqlERy1O3YpWaNiDendC5EzgNBjgd8A7WZ42Id.', 'admin', TRUE, NOW(), NOW()),
  ('Maria Papadopoulos', 'agent@goldenvisa.gr', '$2a$10$rW767ON2TLlhpBvqlERy1O3YpWaNiDendC5EzgNBjgd8A7WZ42Id.', 'agent', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE `email` = `email`;


SELECT '✅ Golden Visa CMS Database Setup Complete!' as Status;
SELECT '📊 Database Structure:' as Info;
SHOW TABLES;
