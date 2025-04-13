/*
  Warnings:

  - The primary key for the `ProductTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductTransaction" DROP CONSTRAINT "ProductTransaction_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProductTransaction_pkey" PRIMARY KEY ("transaction_id", "dispositive_id");
