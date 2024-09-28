-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "playground_quota" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "task_quota" INTEGER NOT NULL DEFAULT 0;
