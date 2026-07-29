/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { ExpensesClient } from "./expenses-client";


export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  try {
    const [expenses, categories] = await Promise.all([
      prisma.expense.findMany({
        orderBy: { expenseDate: "desc" },
        take: 100,
        include: {
          category: { select: { name: true, id: true } },
          branch: { select: { name: true } },
        },
      }),
      prisma.expenseCategory.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return (
      <ExpensesClient
        expenses={expenses.map((e) => ({
          id: e.id,
          description: e.description,
          amount: e.amount.toNumber(),
          currency: e.currency,
          categoryName: e.category?.name || "Uncategorized",
          categoryId: e.categoryId,
          branchName: e.branch?.name || "—",
          status: e.status,
          expenseDate: e.expenseDate,
          paymentMethod: e.paymentMethod,
          supplierOrPayee: e.supplierOrPayee || null,
          receiptNumber: e.receiptNumber || null,
          createdAt: e.createdAt,
        }))}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    );
  } catch {
    return <ExpensesClient expenses={[]} categories={[]} />;
  }
}
