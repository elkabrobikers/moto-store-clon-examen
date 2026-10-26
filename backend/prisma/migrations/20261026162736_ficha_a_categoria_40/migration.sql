/*
  Warnings:

  - You are about to alter the column `categoria` on the `Producto` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.

*/
-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "categoria" SET DATA TYPE VARCHAR(40);
