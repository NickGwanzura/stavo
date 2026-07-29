/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { InstalmentsClient } from "./instalments-client";

export const dynamic = "force-dynamic";

export default async function InstalmentsPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "instalments"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <InstalmentsClient items={items} />;
  } catch {
    return <InstalmentsClient items={[]} />;
  }
}
