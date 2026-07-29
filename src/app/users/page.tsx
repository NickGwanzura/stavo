/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { UsersClient } from "./users-client";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "users"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <UsersClient items={items} />;
  } catch {
    return <UsersClient items={[]} />;
  }
}
