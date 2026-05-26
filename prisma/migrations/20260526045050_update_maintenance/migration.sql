/*
  Warnings:

  - You are about to drop the column `technicianId` on the `maintenances` table. All the data in the column will be lost.
  - Added the required column `technicianName` to the `maintenances` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "maintenances" DROP CONSTRAINT "maintenances_technicianId_fkey";

-- AlterTable
ALTER TABLE "maintenances" DROP COLUMN "technicianId",
ADD COLUMN     "technicianName" TEXT NOT NULL;
