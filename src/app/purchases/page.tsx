import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { PurchasesClient } from "./purchases-client";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  try {
    const tenant = await getCurrentTenant();
    const items = await prisma.purchaseOrder.findMany({
      where: { organisationId: tenant.organisationId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <PurchasesClient items={items} />;
  } catch {
    return <PurchasesClient items={[]} />;
  }
}
