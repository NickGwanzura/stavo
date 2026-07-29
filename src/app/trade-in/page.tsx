import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { TradeInClient } from "./trade-in-client";

export const dynamic = "force-dynamic";

export default async function TradeInPage() {
  try {
    const tenant = await getCurrentTenant();
    const items = await prisma.tradeIn.findMany({
      where: { organisationId: tenant.organisationId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <TradeInClient items={items} />;
  } catch {
    return <TradeInClient items={[]} />;
  }
}
