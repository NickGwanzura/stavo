import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { StockCountsClient } from "./stock-counts-client";

export const dynamic = "force-dynamic";

export default async function StockCountsPage() {
  try {
    const tenant = await getCurrentTenant();
    const items = await prisma.stockCount.findMany({
      where: { organisationId: tenant.organisationId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <StockCountsClient items={items} />;
  } catch {
    return <StockCountsClient items={[]} />;
  }
}
