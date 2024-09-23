-- CreateTable
CREATE TABLE "User_task" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "User_task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User_task" ADD CONSTRAINT "User_task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_task" ADD CONSTRAINT "User_task_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;
