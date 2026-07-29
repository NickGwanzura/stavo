import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { SuppliersClient } from "./suppliers-client";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  try {
    const tenant = await getCurrentTenant();
    const items = await prisma.supplier.findMany({
      where: { organisationId: tenant.organisationId, isActive: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <SuppliersClient items={items} />;
  } catch {
    return <SuppliersClient items={[]} />;
  }
}
