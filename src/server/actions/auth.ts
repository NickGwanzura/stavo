"use server";

import { hashPassword } from "better-auth/crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { secureEqual } from "@/lib/security";

const ownerSetupSchema = z.object({
  setupToken: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128),
});

export async function setupOwner(input: unknown) {
  try {
    const data = ownerSetupSchema.parse(input);
    const expectedToken = process.env.OWNER_SETUP_TOKEN;
    if (!expectedToken || !secureEqual(data.setupToken, expectedToken)) {
      return { success: false as const, error: "Invalid setup token." };
    }

    const passwordHash = await hashPassword(data.password);
    const result = await prisma.$transaction(async (tx) => {
      if ((await tx.user.count()) > 0) {
        throw new Error("OWNER_ALREADY_EXISTS");
      }

      const organisations = await tx.organisation.findMany({
        select: { id: true },
        take: 2,
        orderBy: { createdAt: "asc" },
      });
      const organisation =
        organisations.length === 1
          ? organisations[0]
          : organisations.length === 0
            ? await tx.organisation.create({
                data: { name: "TSM Mobiles", slug: "tsm-mobiles" },
                select: { id: true },
              })
            : null;
      if (!organisation) throw new Error("MULTIPLE_ORGANISATIONS");

      const branch = await tx.branch.upsert({
        where: {
          organisationId_name: {
            organisationId: organisation.id,
            name: "Main Branch",
          },
        },
        update: { isActive: true },
        create: { organisationId: organisation.id, name: "Main Branch" },
        select: { id: true },
      });
      const ownerRole = await tx.role.upsert({
        where: { name: "Owner" },
        update: { description: "Full access to TSM Mobiles" },
        create: { name: "Owner", description: "Full access to TSM Mobiles" },
        select: { id: true },
      });
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          emailVerified: true,
          organisationId: organisation.id,
          branchId: branch.id,
          roles: { create: { roleId: ownerRole.id } },
        },
        select: { id: true },
      });
      await tx.account.create({
        data: {
          userId: user.id,
          providerId: "credential",
          providerAccountId: user.id,
          passwordHash,
        },
      });

      await tx.auditLog.create({
        data: {
          organisationId: organisation.id,
          branchId: branch.id,
          userId: user.id,
          action: "CREATE",
          entity: "OwnerAccount",
          recordId: user.id,
          newValues: { email: data.email, name: data.name },
          reason: "Initial owner provisioning",
        },
      });
      return user;
    });

    return { success: true as const, ownerId: result.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.errors[0]?.message || "Invalid setup details." };
    }
    if (error instanceof Error && error.message === "OWNER_ALREADY_EXISTS") {
      return { success: false as const, error: "The owner account has already been provisioned." };
    }
    if (error instanceof Error && error.message === "MULTIPLE_ORGANISATIONS") {
      return { success: false as const, error: "Owner setup requires exactly one organisation." };
    }
    return { success: false as const, error: "Unable to provision the owner account." };
  }
}
