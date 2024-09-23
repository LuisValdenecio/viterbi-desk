-- AlterTable
ALTER TABLE "User_privilege" ADD COLUMN     "daily_playground_quota" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "task_quota" INTEGER NOT NULL DEFAULT 0;
