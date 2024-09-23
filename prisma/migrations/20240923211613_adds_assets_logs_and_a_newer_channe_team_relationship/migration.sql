-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "team_id" TEXT;

-- AlterTable
ALTER TABLE "User_task" ALTER COLUMN "task_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User_agent" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT,
    "user_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_channel" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT,
    "user_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_channel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_agent" ADD CONSTRAINT "User_agent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_agent" ADD CONSTRAINT "User_agent_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Agent"("agent_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_channel" ADD CONSTRAINT "User_channel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_channel" ADD CONSTRAINT "User_channel_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;
