/*
  Warnings:

  - You are about to drop the column `created_at` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Commercial` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Commercial` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Decider` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Decider` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `DispoIssue` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `DispoIssue` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Helper` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Helper` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Intervention` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Intervention` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `InterventionReport` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Maintainer` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Maintainer` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `SuperAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `SuperAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `MAC` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Assistance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HelperRecommendation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'COMMERCIAL', 'ADMIN', 'SUPERADMIN', 'MAINTAINER', 'DECIDER', 'HELPER');

-- DropForeignKey
ALTER TABLE "HelperRecommendation" DROP CONSTRAINT "HelperRecommendation_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_user_id_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Commercial" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Decider" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "DispoIssue" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Dispositive" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Helper" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Intervention" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "InterventionReport" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Maintainer" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "user_type" "UserType" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SuperAdmin" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "MAC",
DROP COLUMN "updated_at";

-- DropTable
DROP TABLE "Assistance";

-- DropTable
DROP TABLE "HelperRecommendation";
