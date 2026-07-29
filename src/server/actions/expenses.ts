"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const expenseSchema = z.object({
  organisationId: z.string(),
  branchId: z.string(),
  categoryId: z.string(),
  description: z.string().min(1),
  amount: z.coerce.number().positive(),
  currency: z.string().default("USD"),
  paymentMethod: z.string().default("CASH"),
  financialAccountId: z.string().optional(),
  supplierOrPayee: z.string().optional(),
  receiptNumber: z.string().optional(),
  expenseDate: z.string().optional(),
  notes: z.string().optional(),
});

export async function createExpense(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const data = expenseSchema.parse(raw);

    const expense = await prisma.expense.create({
      data: {
        organisationId: data.organisationId,
        branchId: data.branchId,
        categoryId: data.categoryId,
        description: data.description,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        financialAccountId: data.financialAccountId,
        supplierOrPayee: data.supplierOrPayee,
        receiptNumber: data.receiptNumber,
        expenseDate: data.expenseDate ? new Date(data.expenseDate) : new Date(),
        notes: data.notes,
        status: "SUBMITTED",
        createdById: "system",
      },
    });

    revalidatePath("/expenses");
    return { success: true as const, data: expense };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.errors.map((e) => e.message).join(", ") };
    }
    return { success: false as const, error: "Failed to create expense" };
  }
}

export async function approveExpense(expenseId: string, approvedById: string) {
  try {
    await prisma.expense.update({
      where: { id: expenseId },
      data: { status: "APPROVED", approvedById },
    });
    revalidatePath("/expenses");
    return { success: true as const };
  } catch {
    return { success: false as const, error: "Failed to approve expense" };
  }
}

export async function getExpenses(organisationId: string) {
  return prisma.expense.findMany({
    where: { organisationId },
    include: {
      category: { select: { name: true } },
      branch: { select: { name: true } },
    },
    orderBy: { expenseDate: "desc" },
    take: 100,
  });
}

export async function getExpenseCategories(organisationId: string) {
  return prisma.expenseCategory.findMany({
    where: { organisationId, isActive: true },
    orderBy: { name: "asc" },
  });
}
