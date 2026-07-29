import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { WarrantyClient } from "./warranty-client";

export const dynamic = "force-dynamic";

export default async function WarrantyPage() {
  try {
    const tenant = await getCurrentTenant();
    const items = await prisma.warranty.findMany({
      where: { organisationId: tenant.organisationId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <WarrantyClient items={items} />;
  } catch {
    return <WarrantyClient items={[]} />;
  }
}
