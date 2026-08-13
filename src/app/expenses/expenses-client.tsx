"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Search, Plus, DollarSign, CheckCircle } from "lucide-react";

interface ExpenseData {
  id: string;
  description: string;
  amount: number;
  currency: string;
  categoryName: string;
  categoryId: string;
  branchName: string;
  status: string;
  expenseDate: Date;
  paymentMethod: string;
  supplierOrPayee: string | null;
  receiptNumber: string | null;
  createdAt: Date;
}

interface ExpenseCategory {
  id: string;
  name: string;
}

export function ExpensesClient({
  expenses,
  categories,
}: {
  expenses: ExpenseData[];
  categories: ExpenseCategory[];
}) {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = expenses.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.description.toLowerCase().includes(q) || e.categoryName.toLowerCase().includes(q);
  });

  const totalAmount = filtered.reduce((s, e) => s + e.amount, 0);

  async function handleCreateExpense(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const { createExpense } = await import("@/server/actions/expenses");
      const result = await createExpense(fd);
      if (result.success) {
        showToast("Expense recorded", "success");
        setShowForm(false);
        form.reset();
      } else {
        showToast(result.error || "Failed to create expense", "error");
      }
    } catch {
      showToast("Failed to create expense", "error");
    }
  }

  async function handleApprove(expenseId: string) {
    try {
      const { approveExpense } = await import("@/server/actions/expenses");
      const result = await approveExpense(expenseId);
      if (result.success) {
        showToast("Expense approved", "success");
      } else {
        showToast("Failed to approve", "error");
      }
    } catch {
      showToast("Failed to approve expense", "error");
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Expenses"
        description={`${expenses.length} expenses · Total: ${formatCurrency(totalAmount)}`}
        actions={
          <Button className="h-10" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="pl-9 h-11"
          />
        </div>

        {/* New Expense Form */}
        {showForm && (
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <form onSubmit={handleCreateExpense} className="space-y-3">
                <div className="space-y-1">
                  <Label>Description *</Label>
                  <Input name="description" required placeholder="What was this expense for?" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Amount (USD) *</Label>
                    <Input name="amount" type="number" step="0.01" required placeholder="0.00" />
                  </div>
                  <div className="space-y-1">
                    <Label>Category *</Label>
                    <select name="categoryId" required className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                      <option value="">Select...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Payment Method</Label>
                    <select name="paymentMethod" className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                      <option value="CASH">Cash</option>
                      <option value="ECOCASH">EcoCash</option>
                      <option value="ONEMONEY">OneMoney</option>
                      <option value="INNBUCKS">InnBucks</option>
                      <option value="BANK">Bank Transfer / ZIPIT</option>
                      <option value="CARD">Card / Swipe</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Date</Label>
                    <Input name="expenseDate" type="date" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Payee / Supplier</Label>
                  <Input name="supplierOrPayee" placeholder="Who was paid?" />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button type="submit" className="flex-1">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Record Expense
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Expense List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <DollarSign className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-900 mb-1">No expenses yet</h3>
            <p className="text-sm text-slate-500">Record your first expense to get started.</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="lg:hidden space-y-2">
              {filtered.map((exp) => (
                <Card key={exp.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-semibold text-slate-900 truncate">{exp.description}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{exp.categoryName}</p>
                      </div>
                      <StatusBadge status={exp.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{formatDate(exp.expenseDate)}</span>
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(exp.amount)}</span>
                    </div>
                    {exp.status === "SUBMITTED" && (
                      <Button size="sm" variant="success" className="mt-2 w-full" onClick={() => handleApprove(exp.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block rounded-xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((exp) => (
                    <tr key={exp.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-600">{formatDate(exp.expenseDate)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{exp.description}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{exp.categoryName}</td>
                      <td className="px-4 py-3"><StatusBadge status={exp.status} /></td>
                      <td className="px-4 py-3 text-sm font-semibold text-right">{formatCurrency(exp.amount)}</td>
                      <td className="px-4 py-3">
                        {exp.status === "SUBMITTED" && (
                          <Button size="sm" variant="success" onClick={() => handleApprove(exp.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
