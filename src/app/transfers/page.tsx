import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { TransfersClient } from "./transfers-client";

export const dynamic = "force-dynamic";

export default async function TransfersPage() {
  try {
    const tenant = await getCurrentTenant();
    const items = await prisma.stockTransfer.findMany({
      where: { organisationId: tenant.organisationId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const branches = await prisma.branch.findMany({ where: { organisationId: tenant.organisationId, isActive: true }, select: { id: true, name: true } });
    return <TransfersClient items={items} branches={branches} />;
  } catch {
    return <TransfersClient items={[]} branches={[]} />;
  }
}
