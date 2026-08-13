"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { formatDocumentNumber } from "@/lib/sales";
import { getCurrentTenant } from "@/lib/tenant";

const purchaseSchema = z.object({
  supplierId: z.string().cuid().optional().or(z.literal("")),
  productName: z.string().trim().min(1),
  quantity: z.coerce.number().int().positive(),
  expectedPrice: z.coerce.number().min(0),
});

export async function createPurchaseOrder(formData: FormData) {
  try {
    const data = purchaseSchema.parse(Object.fromEntries(formData));
    const tenant = await getCurrentTenant();
    await prisma.$transaction(async (tx) => {
      if (data.supplierId) {
        const supplier = await tx.supplier.findFirst({ where: { id: data.supplierId, organisationId: tenant.organisationId, isActive: true }, select: { id: true } });
        if (!supplier) throw new Error("INVALID_SUPPLIER");
      }
      const organisation = await tx.organisation.update({
        where: { id: tenant.organisationId },
        data: { nextPurchaseOrderNumber: { increment: 1 } },
        select: { nextPurchaseOrderNumber: true },
      });
      const order = await tx.purchaseOrder.create({
        data: {
          organisationId: tenant.organisationId,
          supplierId: data.supplierId || null,
          createdById: tenant.userId,
          orderNumber: formatDocumentNumber("PO", organisation.nextPurchaseOrderNumber - 1),
          outstanding: data.expectedPrice * data.quantity,
          items: { create: { productName: data.productName, quantity: data.quantity, expectedPrice: data.expectedPrice } },
        },
      });
      await tx.auditLog.create({ data: { organisationId: tenant.organisationId, branchId: tenant.branchId, userId: tenant.userId, action: "CREATE", entity: "PurchaseOrder", recordId: order.id, newValues: { orderNumber: order.orderNumber } } });
    });
    revalidatePath("/purchases");
    return { success: true as const };
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_SUPPLIER") return { success: false as const, error: "Choose a valid supplier." };
    return { success: false as const, error: "Unable to create purchase order." };
  }
}
