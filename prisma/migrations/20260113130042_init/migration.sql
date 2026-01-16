-- CreateTable
CREATE TABLE "BirthdayPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Greeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "birthdayPageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Greeting_birthdayPageId_fkey" FOREIGN KEY ("birthdayPageId") REFERENCES "BirthdayPage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BirthdayPage_token_key" ON "BirthdayPage"("token");

-- CreateIndex
CREATE INDEX "Greeting_birthdayPageId_idx" ON "Greeting"("birthdayPageId");
