-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('TRAVELLING', 'GAMES', 'ADVENTURE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "tags" "Tag"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Username_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Username_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "tags" TEXT[],
    "public_id" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "secure_url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagePosition" (
    "id" SERIAL NOT NULL,
    "image_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "position_x" INTEGER NOT NULL,
    "position_y" INTEGER NOT NULL,
    "zoom" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImagePosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email_token" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Phone_token" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ImagePosition_image_id_key" ON "ImagePosition"("image_id");

-- CreateIndex
CREATE INDEX "ImagePosition_image_id_idx" ON "ImagePosition"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "Email_token_userId_key" ON "Email_token"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Phone_token_userId_key" ON "Phone_token"("userId");

-- AddForeignKey
ALTER TABLE "Username_token" ADD CONSTRAINT "Username_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
