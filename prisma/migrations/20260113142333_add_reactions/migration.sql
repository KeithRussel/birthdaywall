-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Greeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "birthdayPageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderName" TEXT,
    "reactions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Greeting_birthdayPageId_fkey" FOREIGN KEY ("birthdayPageId") REFERENCES "BirthdayPage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Greeting" ("birthdayPageId", "content", "createdAt", "id", "senderName", "type") SELECT "birthdayPageId", "content", "createdAt", "id", "senderName", "type" FROM "Greeting";
DROP TABLE "Greeting";
ALTER TABLE "new_Greeting" RENAME TO "Greeting";
CREATE INDEX "Greeting_birthdayPageId_idx" ON "Greeting"("birthdayPageId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
