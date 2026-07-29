/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { StockCountsClient } from "./stock-counts-client";

export const dynamic = "force-dynamic";

export default async function StockCountsPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "stockCounts"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <StockCountsClient items={items} />;
  } catch {
    return <StockCountsClient items={[]} />;
  }
}
