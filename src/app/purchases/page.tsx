/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { PurchasesClient } from "./purchases-client";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "purchases"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <PurchasesClient items={items} />;
  } catch {
    return <PurchasesClient items={[]} />;
  }
}
