/*
  Warnings:

  - Added the required column `stated_at` to the `attempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attempt" ADD COLUMN     "finished_at" TIMESTAMP(3),
ADD COLUMN     "stated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "group" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "join_request" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "join_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "join_request" ADD CONSTRAINT "join_request_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "join_request" ADD CONSTRAINT "join_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
