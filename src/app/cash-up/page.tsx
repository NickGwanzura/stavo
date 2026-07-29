import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { CashUpClient } from "./cash-up-client";

export const dynamic = "force-dynamic";

export default async function CashUpPage() {
  try {
    const tenant = await getCurrentTenant();
    const items = await prisma.cashUp.findMany({
      where: { organisationId: tenant.organisationId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <CashUpClient items={items} />;
  } catch {
    return <CashUpClient items={[]} />;
  }
}
