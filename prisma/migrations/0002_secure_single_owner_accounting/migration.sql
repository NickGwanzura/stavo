ALTER TABLE "organisations"
  ADD COLUMN "nextInvoiceNumber" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "nextQuotationNumber" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "nextPurchaseOrderNumber" INTEGER NOT NULL DEFAULT 1;

UPDATE "organisations" AS organisation
SET
  "nextInvoiceNumber" = GREATEST(1, (
    SELECT COUNT(*)::INTEGER + 1 FROM "invoices" WHERE "organisationId" = organisation.id
  )),
  "nextQuotationNumber" = GREATEST(1, (
    SELECT COUNT(*)::INTEGER + 1 FROM "quotations" WHERE "organisationId" = organisation.id
  )),
  "nextPurchaseOrderNumber" = GREATEST(1, (
    SELECT COUNT(*)::INTEGER + 1 FROM "purchase_orders" WHERE "organisationId" = organisation.id
  ));

ALTER TABLE "accounts"
  ADD COLUMN "refreshTokenExpiresAt" TIMESTAMP(3),
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "sessions"
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "verifications" (
  "id" TEXT NOT NULL,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "verifications_identifier_idx" ON "verifications"("identifier");
