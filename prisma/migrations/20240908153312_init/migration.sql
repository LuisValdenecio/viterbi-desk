-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('enterprise', 'professional');

-- CreateEnum
CREATE TYPE "Subscription_period" AS ENUM ('monthly', 'yearly');

-- CreateEnum
CREATE TYPE "Task_priority" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('owner', 'admin', 'reader');

-- CreateTable
CREATE TABLE "Team" (
    "team_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'functioning',
    "description" VARCHAR(500) NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "User_privilege" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "user_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "user_role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_privilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "img" VARCHAR(255),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "customerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Team_channel" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stripe_subscription" (
    "id" TEXT NOT NULL,
    "plan" "Plan" NOT NULL,
    "user_id" TEXT NOT NULL,
    "period" "Subscription_period" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stripe_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member_invitation" (
    "id" TEXT NOT NULL,
    "guest_email" TEXT NOT NULL,
    "guest_role" "Role" NOT NULL,
    "guest_id" TEXT,
    "team_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation_link" (
    "id" TEXT NOT NULL,
    "token" TEXT,
    "link" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "activatedAt" TIMESTAMP(3),
    "invitation_id" TEXT NOT NULL,

    CONSTRAINT "Invitation_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation_info" (
    "id" TEXT NOT NULL,
    "invitation_info" TEXT NOT NULL,
    "inviter_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitation_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "agent_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'functioning',
    "channel_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("agent_id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "channel_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_connected" BOOLEAN NOT NULL DEFAULT false,
    "description" VARCHAR(500) NOT NULL,
    "owner_id" TEXT,
    "google_token_id" TEXT,
    "discord_token_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("channel_id")
);

-- CreateTable
CREATE TABLE "Google_token" (
    "id" TEXT NOT NULL,
    "access_token" VARCHAR(255) NOT NULL,
    "refresh_token" VARCHAR(255) NOT NULL,
    "scope" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Google_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discord_token" (
    "id" TEXT NOT NULL,
    "access_token" VARCHAR(255) NOT NULL,
    "token_type" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discord_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "task_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "priority" "Task_priority" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'functioning',
    "recurrent" BOOLEAN,
    "agent_id" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "Task_Schedule" (
    "id" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "dayPeriod" TEXT NOT NULL,
    "hourAndMinute" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_customerId_key" ON "User"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Stripe_subscription_user_id_key" ON "Stripe_subscription"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_google_token_id_key" ON "Channel"("google_token_id");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_discord_token_id_key" ON "Channel"("discord_token_id");

-- CreateIndex
CREATE UNIQUE INDEX "Task_schedule_key" ON "Task"("schedule");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_privilege" ADD CONSTRAINT "User_privilege_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_privilege" ADD CONSTRAINT "User_privilege_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_channel" ADD CONSTRAINT "Team_channel_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team_channel" ADD CONSTRAINT "Team_channel_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stripe_subscription" ADD CONSTRAINT "Stripe_subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member_invitation" ADD CONSTRAINT "Member_invitation_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member_invitation" ADD CONSTRAINT "Member_invitation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation_link" ADD CONSTRAINT "Invitation_link_invitation_id_fkey" FOREIGN KEY ("invitation_id") REFERENCES "Member_invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation_info" ADD CONSTRAINT "Invitation_info_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation_info" ADD CONSTRAINT "Invitation_info_invitation_info_fkey" FOREIGN KEY ("invitation_info") REFERENCES "Member_invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("channel_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_google_token_id_fkey" FOREIGN KEY ("google_token_id") REFERENCES "Google_token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_discord_token_id_fkey" FOREIGN KEY ("discord_token_id") REFERENCES "Discord_token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Agent"("agent_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_schedule_fkey" FOREIGN KEY ("schedule") REFERENCES "Task_Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
