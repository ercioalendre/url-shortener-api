-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "fullName" VARCHAR NOT NULL,
    "email" VARCHAR,
    "phone" VARCHAR,
    "role" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "token" VARCHAR,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(6),
    "updatedBy" UUID,
    "softDeletedAt" TIMESTAMP(6),
    "softDeletedBy" UUID,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Url" (
    "id" UUID NOT NULL,
    "originalUrl" VARCHAR NOT NULL,
    "shortenedPath" CHAR(6) NOT NULL,
    "views" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "createdBy" UUID,
    "updatedAt" TIMESTAMP(6),
    "updatedBy" UUID,
    "softDeletedAt" TIMESTAMP(6),
    "softDeletedBy" UUID,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortenedPath_key" ON "Url"("shortenedPath");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_softDeletedBy_fkey" FOREIGN KEY ("softDeletedBy") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_softDeletedBy_fkey" FOREIGN KEY ("softDeletedBy") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
