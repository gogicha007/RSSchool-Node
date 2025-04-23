/*
  Warnings:

  - You are about to drop the `Faforites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Faforites";

-- CreateTable
CREATE TABLE "Favorites" (
    "id" INTEGER NOT NULL DEFAULT 0,
    "artists" TEXT[],
    "albums" TEXT[],
    "tracks" TEXT[],

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);
