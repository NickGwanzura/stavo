import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Resolves the organisation and branch on the server.  Client-submitted IDs
 * must never decide which tenant a record belongs to.
 */
export async function getCurrentTenant() {
  const session = await auth.api.getSession({ headers: headers() });

  if (session?.user.organisationId) {
    const branch = session.user.branchId
      ? await prisma.branch.findFirst({
          where: {
            id: session.user.branchId,
            organisationId: session.user.organisationId,
            isActive: true,
          },
        })
      : await prisma.branch.findFirst({
          where: { organisationId: session.user.organisationId, isActive: true },
          orderBy: { createdAt: "asc" },
        });

    if (branch) return { organisationId: session.user.organisationId, branchId: branch.id, userId: session.user.id };
  }

  // A fresh local install has no account until one is provisioned.  Retain a
  // usable single-tenant demo mode, but never guess between multiple tenants.
  const organisations = await prisma.organisation.findMany({
    select: { id: true },
    take: 2,
    orderBy: { createdAt: "asc" },
  });
  if (organisations.length > 1) {
    throw new Error("No active organisation is available for this account.");
  }
  const organisation = organisations[0] ?? await prisma.organisation.upsert({
    where: { slug: "default" },
    update: {},
    create: { name: "CellDealer", slug: "default" },
  });
  const branch = await prisma.branch.upsert({
    where: {
      organisationId_name: {
        organisationId: organisation.id,
        name: "Main Branch",
      },
    },
    update: { isActive: true },
    create: { organisationId: organisation.id, name: "Main Branch" },
  });

  return { organisationId: organisation.id, branchId: branch.id, userId: session?.user.id ?? null };
}
