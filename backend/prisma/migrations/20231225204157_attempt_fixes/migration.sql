/*
  Warnings:

  - You are about to drop the column `open_answer` on the `attempt_answers` table. All the data in the column will be lost.
  - You are about to drop the column `option_id` on the `attempt_answers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attempt_answers" DROP CONSTRAINT "attempt_answers_option_id_fkey";

-- AlterTable
ALTER TABLE "attempt_answers" DROP COLUMN "open_answer",
DROP COLUMN "option_id";

-- CreateTable
CREATE TABLE "answer_option" (
    "id" TEXT NOT NULL,
    "attempt_answer_id" TEXT,
    "option_id" TEXT,
    "open_answer" TEXT,

    CONSTRAINT "answer_option_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "answer_option" ADD CONSTRAINT "answer_option_attempt_answer_id_fkey" FOREIGN KEY ("attempt_answer_id") REFERENCES "attempt_answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_option" ADD CONSTRAINT "answer_option_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "quiz_question_option"("id") ON DELETE SET NULL ON UPDATE CASCADE;
