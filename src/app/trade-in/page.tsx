/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { TradeInClient } from "./trade-in-client";

export const dynamic = "force-dynamic";

export default async function TradeInPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "tradeIn"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <TradeInClient items={items} />;
  } catch {
    return <TradeInClient items={[]} />;
  }
}
