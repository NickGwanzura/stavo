"use server";
import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createPurchaseOrder(formData: FormData) {
  try {
    const data = z.object({ supplierId: z.string().optional(), productName: z.string().min(1), quantity: z.coerce.number().int().positive(), expectedPrice: z.coerce.number().min(0) }).parse(Object.fromEntries(formData));
    const tenant = await getCurrentTenant();
    const count = await prisma.purchaseOrder.count({ where: { organisationId: tenant.organisationId } });
    await prisma.purchaseOrder.create({ data: { organisationId: tenant.organisationId, supplierId: data.supplierId || null, createdById: tenant.userId ?? "system", orderNumber: `PO-${String(count + 1).padStart(5, "0")}`, outstanding: data.expectedPrice * data.quantity, items: { create: { productName: data.productName, quantity: data.quantity, expectedPrice: data.expectedPrice } } } });
    revalidatePath("/purchases"); return { success: true as const };
  } catch { return { success: false as const, error: "Unable to create purchase order." }; }
}
