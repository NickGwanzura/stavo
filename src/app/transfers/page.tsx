/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { TransfersClient } from "./transfers-client";

export const dynamic = "force-dynamic";

export default async function TransfersPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "transfers"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <TransfersClient items={items} />;
  } catch {
    return <TransfersClient items={[]} />;
  }
}
