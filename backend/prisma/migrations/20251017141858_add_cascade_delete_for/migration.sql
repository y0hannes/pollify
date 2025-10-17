-- DropForeignKey
ALTER TABLE "public"."Option" DROP CONSTRAINT "Option_pollId_fkey";

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
