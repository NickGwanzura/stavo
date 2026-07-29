import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { UsersClient } from "./users-client";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  try {
    const tenant = await getCurrentTenant();
    const items = await prisma.user.findMany({
      where: { organisationId: tenant.organisationId, isActive: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <UsersClient items={items} />;
  } catch {
    return <UsersClient items={[]} />;
  }
}
