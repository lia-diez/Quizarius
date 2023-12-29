/*
  Warnings:

  - You are about to drop the `attempt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attempt" DROP CONSTRAINT "attempt_quiz_id_fkey";

-- DropForeignKey
ALTER TABLE "attempt" DROP CONSTRAINT "attempt_user_id_fkey";

-- DropForeignKey
ALTER TABLE "attempt_answers" DROP CONSTRAINT "attempt_answers_attempt_id_fkey";

-- DropTable
DROP TABLE "attempt";

-- CreateTable
CREATE TABLE "user_attempt" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stated_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "user_attempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_attempt" ADD CONSTRAINT "user_attempt_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_attempt" ADD CONSTRAINT "user_attempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_answers" ADD CONSTRAINT "attempt_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "user_attempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
