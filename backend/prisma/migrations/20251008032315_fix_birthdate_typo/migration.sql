/*
  Warnings:

  - You are about to drop the column `bithDate` on the `authors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "authors" DROP COLUMN "bithDate",
ADD COLUMN     "birthDate" TIMESTAMP(3);
