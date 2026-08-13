import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Resolves the organisation and branch on the server.  Client-submitted IDs
 * must never decide which tenant a record belongs to.
 */
export async function getCurrentTenant() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id || !session.user.organisationId) {
    throw new Error("AUTHENTICATION_REQUIRED");
  }

  const activeOwner = await prisma.user.findFirst({
    where: {
      id: session.user.id,
      organisationId: session.user.organisationId,
      isActive: true,
      roles: { some: { role: { name: "Owner" } } },
    },
    select: { id: true },
  });

  if (!activeOwner) {
    throw new Error("OWNER_ACCESS_REQUIRED");
  }

  if (session.user.organisationId) {
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

  throw new Error("ACTIVE_BRANCH_REQUIRED");
}
