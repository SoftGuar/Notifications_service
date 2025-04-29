-- AlterTable
ALTER TABLE "DispoIssue" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Dispositive" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Intervention" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InterventionReport" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "MAC" DROP DEFAULT;
