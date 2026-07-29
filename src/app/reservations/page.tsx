/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { ReservationsClient } from "./reservations-client";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  try {
    const items = await (prisma as unknown as Record<string, any>)[
      "reservations"
    ].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <ReservationsClient items={items} />;
  } catch {
    return <ReservationsClient items={[]} />;
  }
}
