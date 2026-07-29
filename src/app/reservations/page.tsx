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
    const inventory = await prisma.inventoryItem.findMany({ where: { organisationId: tenant.organisationId, branchId: tenant.branchId, status: "IN_STOCK", isActive: true }, select: { id: true, productName: true, stockNumber: true }, take: 100 });
    return <ReservationsClient items={items} inventory={inventory.map(i => ({ id: i.id, name: i.productName || i.stockNumber }))} />;
  } catch {
    return <ReservationsClient items={[]} inventory={[]} />;
  }
}
