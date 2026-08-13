import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { PurchasesClient } from "./purchases-client";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  const tenant = await getCurrentTenant();
  const items = await prisma.purchaseOrder.findMany({
      where: { organisationId: tenant.organisationId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  const suppliers = await prisma.supplier.findMany({ where: { organisationId: tenant.organisationId, isActive: true }, select: { id: true, name: true } });
  return <PurchasesClient items={items} suppliers={suppliers} />;
}
