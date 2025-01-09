/*
  Warnings:

  - You are about to drop the `_groupmembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_groupmembers` DROP FOREIGN KEY `_GroupMembers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_groupmembers` DROP FOREIGN KEY `_GroupMembers_B_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `groupeId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_groupmembers`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_groupeId_fkey` FOREIGN KEY (`groupeId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
