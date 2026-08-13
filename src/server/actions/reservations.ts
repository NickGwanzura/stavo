"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";

export async function createReservation(formData: FormData) {
  try {
    const data = z.object({ itemId: z.string().cuid(), expiryDate: z.string().min(1), deposit: z.coerce.number().min(0).optional() }).parse(Object.fromEntries(formData));
    const expiryDate = new Date(`${data.expiryDate}T23:59:59`);
    if (!Number.isFinite(expiryDate.getTime()) || expiryDate <= new Date()) return { success: false as const, error: "Choose a future expiry date." };
    const tenant = await getCurrentTenant();
    await prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findFirst({ where: { id: data.itemId, organisationId: tenant.organisationId, branchId: tenant.branchId, status: "IN_STOCK", isActive: true }, select: { id: true } });
      if (!item) throw new Error("NOT_AVAILABLE");
      const updated = await tx.inventoryItem.updateMany({ where: { id: item.id, organisationId: tenant.organisationId, status: "IN_STOCK" }, data: { status: "RESERVED" } });
      if (updated.count !== 1) throw new Error("NOT_AVAILABLE");
      const reservation = await tx.customerReservation.create({ data: { organisationId: tenant.organisationId, itemId: item.id, userId: tenant.userId, expiryDate, deposit: data.deposit || 0 } });
      await tx.auditLog.create({ data: { organisationId: tenant.organisationId, branchId: tenant.branchId, userId: tenant.userId, action: "CREATE", entity: "Reservation", recordId: reservation.id, newValues: { itemId: item.id, expiryDate: expiryDate.toISOString(), deposit: String(data.deposit || 0) } } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    revalidatePath("/reservations");
    return { success: true as const };
  } catch {
    return { success: false as const, error: "This item is no longer available." };
  }
}
