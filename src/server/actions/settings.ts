"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";

const organisationSchema = z.object({
  name: z.string().trim().min(1, "Company name is required"),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  email: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
  taxId: z.string().trim().optional(),
  invoicePrefix: z.string().trim().min(1).max(12),
  quotationPrefix: z.string().trim().min(1).max(12),
  defaultCurrency: z.string().trim().min(3).max(3),
  defaultPaymentTerms: z.string().trim().optional(),
  receiptFooter: z.string().trim().optional(),
  warrantyTerms: z.string().trim().optional(),
});

export async function updateOrganisationSettings(formData: FormData) {
  try {
    const data = organisationSchema.parse(Object.fromEntries(formData));
    const tenant = await getCurrentTenant();
    await prisma.$transaction(async (tx) => {
      const previous = await tx.organisation.findUniqueOrThrow({ where: { id: tenant.organisationId }, select: { name: true, address: true, phone: true, email: true, taxId: true, invoicePrefix: true, quotationPrefix: true, defaultCurrency: true } });
      await tx.organisation.update({
        where: { id: tenant.organisationId },
        data: {
        ...data,
        address: data.address || null,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        email: data.email || null,
        taxId: data.taxId || null,
        defaultPaymentTerms: data.defaultPaymentTerms || null,
        receiptFooter: data.receiptFooter || null,
        warrantyTerms: data.warrantyTerms || null,
        },
      });
      await tx.auditLog.create({ data: { organisationId: tenant.organisationId, branchId: tenant.branchId, userId: tenant.userId, action: "UPDATE", entity: "Organisation", recordId: tenant.organisationId, previousValues: previous, newValues: JSON.parse(JSON.stringify(data)) } });
    });
    revalidatePath("/settings");
    revalidatePath("/invoices");
    return { success: true as const };
  } catch (error) {
    const message = error instanceof z.ZodError ? error.errors.map((item) => item.message).join(", ") : "Unable to save company settings.";
    return { success: false as const, error: message };
  }
}
