/*
  Warnings:

  - Added the required column `adminToken` to the `BirthdayPage` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BirthdayPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "token" TEXT NOT NULL,
    "adminToken" TEXT NOT NULL,
    "birthdayDate" DATETIME,
    "celebrantPhotos" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_BirthdayPage" ("birthdayDate", "celebrantPhotos", "createdAt", "id", "name", "title", "token") SELECT "birthdayDate", "celebrantPhotos", "createdAt", "id", "name", "title", "token" FROM "BirthdayPage";
DROP TABLE "BirthdayPage";
ALTER TABLE "new_BirthdayPage" RENAME TO "BirthdayPage";
CREATE UNIQUE INDEX "BirthdayPage_token_key" ON "BirthdayPage"("token");
CREATE UNIQUE INDEX "BirthdayPage_adminToken_key" ON "BirthdayPage"("adminToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
