-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FailureCategory" ADD VALUE 'product';
ALTER TYPE "FailureCategory" ADD VALUE 'legal';
ALTER TYPE "FailureCategory" ADD VALUE 'unit_economics';
ALTER TYPE "FailureCategory" ADD VALUE 'operations';
ALTER TYPE "FailureCategory" ADD VALUE 'leadership';
ALTER TYPE "FailureCategory" ADD VALUE 'community';
ALTER TYPE "FailureCategory" ADD VALUE 'strategy';
ALTER TYPE "FailureCategory" ADD VALUE 'cashflow';
ALTER TYPE "FailureCategory" ADD VALUE 'platform_risk';
ALTER TYPE "FailureCategory" ADD VALUE 'execution';
