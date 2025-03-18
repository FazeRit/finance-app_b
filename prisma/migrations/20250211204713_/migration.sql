/*
  Warnings:

  - A unique constraint covering the columns `[categoryId]` on the table `expense_limits` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "expense_limits_categoryId_key" ON "expense_limits"("categoryId");
