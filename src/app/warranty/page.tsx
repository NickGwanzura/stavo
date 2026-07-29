/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { WarrantyClient } from "./warranty-client";

export const dynamic = "force-dynamic";

export default async function WarrantyPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "warranty"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <WarrantyClient items={items} />;
  } catch {
    return <WarrantyClient items={[]} />;
  }
}
