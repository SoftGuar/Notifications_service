/*
  Warnings:

  - Added the required column `privilege` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "privilege" INTEGER NOT NULL;
