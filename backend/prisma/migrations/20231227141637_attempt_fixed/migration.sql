-- AlterTable
ALTER TABLE "answer_option" ALTER COLUMN "is_correct" DROP NOT NULL,
ALTER COLUMN "is_correct" DROP DEFAULT;
