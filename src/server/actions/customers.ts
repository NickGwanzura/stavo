"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentTenant } from "@/lib/tenant";

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  nationalId: z.string().optional(),
  customerType: z.string().default("Walk-in"),
  creditLimit: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

export async function createCustomer(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const data = customerSchema.parse(raw);
    const tenant = await getCurrentTenant();

    const customer = await prisma.customer.create({
      data: {
        organisationId: tenant.organisationId,
        name: data.name,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email || null,
        address: data.address,
        nationalId: data.nationalId,
        customerType: data.customerType,
        creditLimit: data.creditLimit || 0,
        notes: data.notes,
      },
    });
    await prisma.auditLog.create({ data: { organisationId: tenant.organisationId, branchId: tenant.branchId, userId: tenant.userId, action: "CREATE", entity: "Customer", recordId: customer.id, newValues: { name: customer.name, phone: customer.phone } } });

    revalidatePath("/customers");
    return { success: true as const, data: customer };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.errors.map((e) => e.message).join(", ") };
    }
    return { success: false as const, error: "Failed to create customer" };
  }
}

export async function getCustomers() {
  const tenant = await getCurrentTenant();
  return prisma.customer.findMany({
    where: { organisationId: tenant.organisationId, isActive: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
