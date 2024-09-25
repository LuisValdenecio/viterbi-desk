-- AlterTable
ALTER TABLE "User_privilege" ADD COLUMN     "used_daily_playground_quota" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "used_task_quota" INTEGER NOT NULL DEFAULT 0;
