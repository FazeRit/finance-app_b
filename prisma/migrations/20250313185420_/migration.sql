-- DropForeignKey
ALTER TABLE "expense_limits" DROP CONSTRAINT "expense_limits_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_categoryId_fkey";
