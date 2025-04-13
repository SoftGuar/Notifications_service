/*
  Warnings:

  - You are about to drop the column `role` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Commercial` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Decider` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Helper` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Maintainer` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `SuperAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Commercial" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Decider" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Helper" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Maintainer" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "SuperAdmin" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";
