/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { CashUpClient } from "./cash-up-client";

export const dynamic = "force-dynamic";

export default async function CashUpPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "cashUp"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <CashUpClient items={items} />;
  } catch {
    return <CashUpClient items={[]} />;
  }
}
