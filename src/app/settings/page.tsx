import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const tenant = await getCurrentTenant();
  const organisation = await prisma.organisation.findUniqueOrThrow({ where: { id: tenant.organisationId } });
  return <SettingsClient organisation={organisation} />;
}
