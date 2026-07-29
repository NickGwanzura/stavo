/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "settings"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <SettingsClient items={items} />;
  } catch {
    return <SettingsClient items={[]} />;
  }
}
