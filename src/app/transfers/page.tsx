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
    return <TransfersClient items={items} />;
  } catch {
    return <TransfersClient items={[]} />;
  }
}
