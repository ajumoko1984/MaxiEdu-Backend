-- Migration: Add new school entities and columns (2025-12-26)
-- Run this on your MySQL database after taking a backup.

-- Add columns to students
ALTER TABLE `students`
  ADD COLUMN `otherNames` varchar(255) NULL,
  ADD COLUMN `placeOfBirth` varchar(255) NULL,
  ADD COLUMN `nationality` varchar(255) NULL,
  ADD COLUMN `stateOfOrigin` varchar(255) NULL,
  ADD COLUMN `lga` varchar(255) NULL,
  ADD COLUMN `religion` varchar(255) NULL,
  ADD COLUMN `bloodGroup` varchar(50) NULL,
  ADD COLUMN `genotype` varchar(50) NULL,
  ADD COLUMN `previousSchool` varchar(255) NULL,
  ADD COLUMN `status` varchar(50) NOT NULL DEFAULT 'Active',
  ADD COLUMN `knownMedicalConditions` text NULL,
  ADD COLUMN `allergies` text NULL,
  ADD COLUMN `specialNeeds` text NULL,
  ADD COLUMN `emergencyContactName` varchar(255) NULL,
  ADD COLUMN `emergencyContactPhone` varchar(50) NULL,
  ADD COLUMN `homeAddress` varchar(255) NULL,
  ADD COLUMN `dateOfBirth` date NULL,
  ADD COLUMN `gender` varchar(50) NULL,
  ADD COLUMN `age` int NULL,
  ADD COLUMN `faceDescriptor` json NULL,
  ADD COLUMN `rfid` varchar(255) NULL;

-- Add columns to teachers
ALTER TABLE `teachers`
  ADD COLUMN `otherNames` varchar(255) NULL,
  ADD COLUMN `title` varchar(50) NULL,
  ADD COLUMN `employmentType` varchar(50) NULL,
  ADD COLUMN `dateEmployed` date NULL,
  ADD COLUMN `maritalStatus` varchar(50) NULL,
  ADD COLUMN `nationality` varchar(255) NULL,
  ADD COLUMN `stateOfOrigin` varchar(255) NULL,
  ADD COLUMN `lga` varchar(255) NULL,
  ADD COLUMN `religion` varchar(255) NULL,
  ADD COLUMN `gender` varchar(50) NULL,
  ADD COLUMN `dateOfBirth` date NULL,
  ADD COLUMN `faceDescriptor` json NULL,
  ADD COLUMN `rfid` varchar(255) NULL;

-- Add classId to subjects
ALTER TABLE `subjects`
  ADD COLUMN `classId` char(36) NULL;

-- Create parents table
CREATE TABLE IF NOT EXISTS `parents` (
  `id` char(36) NOT NULL,
  `schoolId` char(36) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `relationship` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phonePrimary` varchar(50) DEFAULT NULL,
  `phoneAlternative` varchar(50) DEFAULT NULL,
  `homeAddress` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `placeOfWork` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create sessions table
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` char(36) NOT NULL,
  `sessionName` varchar(255) NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `isOpen` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create exams table
CREATE TABLE IF NOT EXISTS `exams` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sessionId` char(36) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create scores table
CREATE TABLE IF NOT EXISTS `scores` (
  `id` char(36) NOT NULL,
  `scoreId` varchar(255) DEFAULT NULL,
  `subjectId` char(36) DEFAULT NULL,
  `studentId` char(36) DEFAULT NULL,
  `classId` char(36) DEFAULT NULL,
  `examId` char(36) DEFAULT NULL,
  `sessionId` char(36) DEFAULT NULL,
  `firstCA` float NOT NULL DEFAULT 0,
  `secondCA` float NOT NULL DEFAULT 0,
  `exam` float NOT NULL DEFAULT 0,
  `total` float NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create grades table
CREATE TABLE IF NOT EXISTS `grades` (
  `id` char(36) NOT NULL,
  `grade` varchar(10) NOT NULL,
  `min` int NOT NULL,
  `max` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create attendances table
CREATE TABLE IF NOT EXISTS `attendances` (
  `id` char(36) NOT NULL,
  `userId` char(36) NOT NULL,
  `userType` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'present',
  `checkInTime` time DEFAULT NULL,
  `checkOutTime` time DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `markedBy` char(36) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `confidenceScore` float DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create materials table
CREATE TABLE IF NOT EXISTS `materials` (
  `id` char(36) NOT NULL,
  `schoolId` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `fileUrl` varchar(512) DEFAULT NULL,
  `fileType` varchar(50) DEFAULT NULL,
  `uploadedBy` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create alumni table
CREATE TABLE IF NOT EXISTS `alumni` (
  `id` char(36) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `yearGraduated` varchar(50) DEFAULT NULL,
  `currentOccupation` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create settings table
CREATE TABLE IF NOT EXISTS `settings` (
  `id` char(36) NOT NULL,
  `settingKey` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `themeColor` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Note: consider adding indexes, unique constraints, and foreign keys as required for production.
