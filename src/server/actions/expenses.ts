"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { getPaymentAccountType, paymentMethods } from "@/lib/sales";

const expenseSchema = z.object({
  categoryId: z.string().cuid(),
  description: z.string().trim().min(1),
  amount: z.coerce.number().positive(),
  currency: z.string().trim().length(3).default("USD"),
  paymentMethod: z.enum(paymentMethods.map((method) => method.code) as [string, ...string[]]).default("CASH"),
  financialAccountId: z.string().cuid().optional().or(z.literal("")),
  supplierOrPayee: z.string().trim().optional(),
  receiptNumber: z.string().trim().optional(),
  expenseDate: z.string().optional(),
  notes: z.string().trim().optional(),
});

export async function createExpense(formData: FormData) {
  try {
    const data = expenseSchema.parse(Object.fromEntries(formData));
    const tenant = await getCurrentTenant();
    const expense = await prisma.$transaction(async (tx) => {
      const category = await tx.expenseCategory.findFirst({ where: { id: data.categoryId, organisationId: tenant.organisationId, isActive: true }, select: { id: true } });
      if (!category) throw new Error("INVALID_CATEGORY");
      const account = data.financialAccountId
        ? await tx.financialAccount.findFirst({ where: { id: data.financialAccountId, organisationId: tenant.organisationId, isActive: true }, select: { id: true } })
        : await tx.financialAccount.findFirst({ where: { organisationId: tenant.organisationId, type: getPaymentAccountType(data.paymentMethod as never), isActive: true }, select: { id: true } });
      if (!account) throw new Error("INVALID_ACCOUNT");
      const created = await tx.expense.create({
        data: {
          organisationId: tenant.organisationId,
          branchId: tenant.branchId,
          categoryId: data.categoryId,
          description: data.description,
          amount: data.amount,
          currency: data.currency.toUpperCase(),
          paymentMethod: data.paymentMethod,
          financialAccountId: account.id,
          supplierOrPayee: data.supplierOrPayee,
          receiptNumber: data.receiptNumber,
          expenseDate: data.expenseDate ? new Date(`${data.expenseDate}T00:00:00`) : new Date(),
          notes: data.notes,
          status: "SUBMITTED",
          createdById: tenant.userId,
        },
      });
      await tx.auditLog.create({ data: { organisationId: tenant.organisationId, branchId: tenant.branchId, userId: tenant.userId, action: "CREATE", entity: "Expense", recordId: created.id, newValues: { amount: String(data.amount), status: "SUBMITTED" } } });
      return created;
    });
    revalidatePath("/expenses");
    return { success: true as const, data: expense };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false as const, error: error.errors.map((entry) => entry.message).join(", ") };
    return { success: false as const, error: "Failed to create expense." };
  }
}

export async function approveExpense(expenseId: string) {
  try {
    const id = z.string().cuid().parse(expenseId);
    const tenant = await getCurrentTenant();
    await prisma.$transaction(async (tx) => {
      const expense = await tx.expense.findFirst({ where: { id, organisationId: tenant.organisationId, status: "SUBMITTED" } });
      if (!expense) throw new Error("NOT_FOUND");
      const updated = await tx.expense.updateMany({ where: { id, organisationId: tenant.organisationId, status: "SUBMITTED" }, data: { status: "APPROVED", approvedById: tenant.userId } });
      if (updated.count !== 1) throw new Error("NOT_FOUND");
      if (expense.financialAccountId) {
        await tx.financialAccount.update({ where: { id: expense.financialAccountId }, data: { balance: { decrement: expense.amount } } });
      }
      await tx.auditLog.create({ data: { organisationId: tenant.organisationId, branchId: tenant.branchId, userId: tenant.userId, action: "APPROVE", entity: "Expense", recordId: id, previousValues: { status: "SUBMITTED" }, newValues: { status: "APPROVED", amount: expense.amount.toString() } } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    revalidatePath("/expenses");
    return { success: true as const };
  } catch {
    return { success: false as const, error: "Expense was not found or was already approved." };
  }
}

export async function getExpenses() {
  const tenant = await getCurrentTenant();
  return prisma.expense.findMany({ where: { organisationId: tenant.organisationId }, include: { category: { select: { name: true } }, branch: { select: { name: true } } }, orderBy: { expenseDate: "desc" }, take: 100 });
}

export async function getExpenseCategories() {
  const tenant = await getCurrentTenant();
  return prisma.expenseCategory.findMany({ where: { organisationId: tenant.organisationId, isActive: true }, orderBy: { name: "asc" } });
}
