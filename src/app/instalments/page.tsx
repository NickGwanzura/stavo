import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { InstalmentsClient } from "./instalments-client";

export const dynamic = "force-dynamic";

export default async function InstalmentsPage() {
  try {
    const tenant = await getCurrentTenant();
    const items = await prisma.instalmentAgreement.findMany({
      where: { organisationId: tenant.organisationId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <InstalmentsClient items={items} />;
  } catch {
    return <InstalmentsClient items={[]} />;
  }
}
