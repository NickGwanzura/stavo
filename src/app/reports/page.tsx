/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { ReportsClient } from "./reports-client";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "reports"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <ReportsClient items={items} />;
  } catch {
    return <ReportsClient items={[]} />;
  }
}
