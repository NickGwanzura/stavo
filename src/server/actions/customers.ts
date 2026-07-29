"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const customerSchema = z.object({
  organisationId: z.string(),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  nationalId: z.string().optional(),
  customerType: z.string().default("Walk-in"),
  creditLimit: z.number().optional(),
  notes: z.string().optional(),
});

export async function createCustomer(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const data = customerSchema.parse(raw);

    const customer = await prisma.customer.create({
      data: {
        organisationId: data.organisationId,
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

    revalidatePath("/customers");
    return { success: true as const, data: customer };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.errors.map((e) => e.message).join(", ") };
    }
    return { success: false as const, error: "Failed to create customer" };
  }
}

export async function getCustomers(organisationId: string) {
  return prisma.customer.findMany({
    where: { organisationId, isActive: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
