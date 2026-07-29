"use server";

import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const lines = z.array(z.object({ name: z.string().min(1), price: z.number().positive(), qty: z.number().int().positive() })).min(1);

export async function completeSale(input: { items: z.infer<typeof lines>; paymentMethod: string }) {
  try {
    const items = lines.parse(input.items); const tenant = await getCurrentTenant();
    const organisation = await prisma.organisation.findUniqueOrThrow({ where: { id: tenant.organisationId } });
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const invoice = await prisma.$transaction(async (tx) => {
      const count = await tx.invoice.count({ where: { organisationId: tenant.organisationId } });
      const invoice = await tx.invoice.create({ data: { organisationId: tenant.organisationId, branchId: tenant.branchId, createdById: tenant.userId ?? "system", invoiceNumber: `${organisation.invoicePrefix}-${String(count + 1).padStart(5, "0")}`, subtotal: total, total, amountPaid: total, balanceDue: 0, currency: organisation.defaultCurrency, status: "PAID", paymentTerms: organisation.defaultPaymentTerms, warrantyTerms: organisation.warrantyTerms, items: { create: items.map((item) => ({ description: item.name, quantity: item.qty, unitPrice: item.price, total: item.price * item.qty })) } } });
      await tx.sale.create({ data: { organisationId: tenant.organisationId, branchId: tenant.branchId, invoiceId: invoice.id, total, currency: organisation.defaultCurrency, items: { create: items.map((item) => ({ description: item.name, quantity: item.qty, unitPrice: item.price, total: item.price * item.qty })) } } });
      return invoice;
    });
    revalidatePath("/invoices"); revalidatePath("/"); return { success: true as const, invoiceId: invoice.id };
  } catch { return { success: false as const, error: "Unable to complete sale." }; }
}

export async function createQuotation(input: { description: string; price: number }) {
  try {
    const data = z.object({ description: z.string().min(1), price: z.number().positive() }).parse(input); const tenant = await getCurrentTenant();
    const organisation = await prisma.organisation.findUniqueOrThrow({ where: { id: tenant.organisationId } });
    const count = await prisma.quotation.count({ where: { organisationId: tenant.organisationId } });
    await prisma.quotation.create({ data: { organisationId: tenant.organisationId, branchId: tenant.branchId, createdById: tenant.userId ?? "system", quotationNumber: `${organisation.quotationPrefix}-${String(count + 1).padStart(5, "0")}`, subtotal: data.price, total: data.price, currency: organisation.defaultCurrency, paymentTerms: organisation.defaultPaymentTerms, warrantyTerms: organisation.warrantyTerms, items: { create: { description: data.description, quantity: 1, unitPrice: data.price, total: data.price } } } });
    revalidatePath("/quotations"); return { success: true as const };
  } catch { return { success: false as const, error: "Unable to create quotation." }; }
}
