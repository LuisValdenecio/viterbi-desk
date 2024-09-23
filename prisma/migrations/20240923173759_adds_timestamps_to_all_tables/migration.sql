/*
  Warnings:

  - Added the required column `updatedAt` to the `Invitation_link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User_task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation_link" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User_task" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
