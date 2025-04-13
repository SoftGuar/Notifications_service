-- CreateTable
CREATE TABLE "_UserHelpers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserHelpers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserHelpers_B_index" ON "_UserHelpers"("B");

-- AddForeignKey
ALTER TABLE "_UserHelpers" ADD CONSTRAINT "_UserHelpers_A_fkey" FOREIGN KEY ("A") REFERENCES "Helper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserHelpers" ADD CONSTRAINT "_UserHelpers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
