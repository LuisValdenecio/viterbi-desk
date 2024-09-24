/*
  Warnings:

  - You are about to drop the `Team_channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_agent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_task` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Team_channel" DROP CONSTRAINT "Team_channel_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "Team_channel" DROP CONSTRAINT "Team_channel_team_id_fkey";

-- DropForeignKey
ALTER TABLE "User_agent" DROP CONSTRAINT "User_agent_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "User_agent" DROP CONSTRAINT "User_agent_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User_channel" DROP CONSTRAINT "User_channel_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "User_channel" DROP CONSTRAINT "User_channel_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User_task" DROP CONSTRAINT "User_task_task_id_fkey";

-- DropForeignKey
ALTER TABLE "User_task" DROP CONSTRAINT "User_task_user_id_fkey";

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Team_channel";

-- DropTable
DROP TABLE "User_agent";

-- DropTable
DROP TABLE "User_channel";

-- DropTable
DROP TABLE "User_task";

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
