-- CreateTable
CREATE TABLE "public"."P2POffer" (
    "id" SERIAL NOT NULL,
    "offerType" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sellerId" INTEGER NOT NULL,

    CONSTRAINT "P2POffer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."P2POffer" ADD CONSTRAINT "P2POffer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
