-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "completoScanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completoTime" TIMESTAMP(3),
ADD COLUMN     "entradaScanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "entradaTime" TIMESTAMP(3),
ADD COLUMN     "entregaScanned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "entregaTime" TIMESTAMP(3);
