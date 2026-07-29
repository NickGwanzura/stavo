/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { SuppliersClient } from "./suppliers-client";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "suppliers"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <SuppliersClient items={items} />;
  } catch {
    return <SuppliersClient items={[]} />;
  }
}
