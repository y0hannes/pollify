-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "voterID" TEXT,
    "optionId" TEXT NOT NULL,
    "votedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_voterID_optionId_key" ON "Vote"("voterID", "optionId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterID_fkey" FOREIGN KEY ("voterID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
