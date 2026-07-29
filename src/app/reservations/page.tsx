import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { ReservationsClient } from "./reservations-client";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  try {
    const tenant = await getCurrentTenant();
    const items = await prisma.customerReservation.findMany({
      where: { organisationId: tenant.organisationId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <ReservationsClient items={items} />;
  } catch {
    return <ReservationsClient items={[]} />;
  }
}
