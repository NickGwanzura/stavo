"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentTenant } from "@/lib/tenant";

const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  currency: z.string().default("USD"),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
});

export async function createSupplier(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const data = supplierSchema.parse(raw);
    const tenant = await getCurrentTenant();

    const supplier = await prisma.supplier.create({
      data: {
        organisationId: tenant.organisationId,
        name: data.name,
        contactPerson: data.contactPerson,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email || null,
        address: data.address,
        currency: data.currency,
        paymentTerms: data.paymentTerms,
        notes: data.notes,
      },
    });
    await prisma.auditLog.create({ data: { organisationId: tenant.organisationId, branchId: tenant.branchId, userId: tenant.userId, action: "CREATE", entity: "Supplier", recordId: supplier.id, newValues: { name: supplier.name, phone: supplier.phone } } });

    revalidatePath("/suppliers");
    return { success: true as const, data: supplier };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.errors.map((e) => e.message).join(", ") };
    }
    return { success: false as const, error: "Failed to create supplier" };
  }
}

export async function getSuppliers() {
  const tenant = await getCurrentTenant();
  return prisma.supplier.findMany({
    where: { organisationId: tenant.organisationId, isActive: true },
    orderBy: { name: "asc" },
    take: 100,
  });
}
