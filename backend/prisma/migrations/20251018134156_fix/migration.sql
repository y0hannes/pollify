/*
  Warnings:

  - You are about to drop the column `voterID` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voterId,optionId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Vote" DROP CONSTRAINT "Vote_voterID_fkey";

-- DropIndex
DROP INDEX "public"."Vote_voterID_optionId_key";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "voterID",
ADD COLUMN     "voterId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voterId_optionId_key" ON "Vote"("voterId", "optionId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
