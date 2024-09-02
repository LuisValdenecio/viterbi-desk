-- CreateTable
CREATE TABLE "Team" (
    "team_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "User_privilege" (
    "id" TEXT NOT NULL,
    "privilege" TEXT,
    "user_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,

    CONSTRAINT "User_privilege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "img" VARCHAR(255),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Stripe_sub" (
    "sub_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Stripe_sub_pkey" PRIMARY KEY ("sub_id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "agent_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "channel_id" TEXT NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("agent_id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "channel_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("channel_id")
);

-- CreateTable
CREATE TABLE "Task" (
    "task_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "recurrent" BOOLEAN,
    "schedule" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("task_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_privilege_user_id_key" ON "User_privilege"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_privilege_channel_id_key" ON "User_privilege"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stripe_sub_user_id_key" ON "Stripe_sub"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_channel_id_key" ON "Agent"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_user_id_key" ON "Channel"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Task_agent_id_key" ON "Task"("agent_id");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_privilege" ADD CONSTRAINT "User_privilege_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_privilege" ADD CONSTRAINT "User_privilege_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("channel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stripe_sub" ADD CONSTRAINT "Stripe_sub_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("channel_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Agent"("agent_id") ON DELETE RESTRICT ON UPDATE CASCADE;
