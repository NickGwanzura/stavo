import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const tenant = await getCurrentTenant();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [sales, expenses, stock, accounts] = await Promise.all([
    prisma.sale.aggregate({ where: { organisationId: tenant.organisationId, status: "COMPLETED", saleDate: { gte: startOfMonth } }, _sum: { total: true, grossProfit: true }, _count: true }),
    prisma.expense.aggregate({ where: { organisationId: tenant.organisationId, status: "APPROVED", expenseDate: { gte: startOfMonth } }, _sum: { amount: true }, _count: true }),
    prisma.inventoryItem.count({ where: { organisationId: tenant.organisationId, isActive: true, status: "IN_STOCK" } }),
    prisma.financialAccount.findMany({ where: { organisationId: tenant.organisationId, isActive: true }, select: { id: true, name: true, balance: true, currency: true }, orderBy: { name: "asc" } }),
  ]);
  const grossProfit = sales._sum.grossProfit?.toNumber() || 0;
  const approvedExpenses = expenses._sum.amount?.toNumber() || 0;
  const cards = [
    ["Sales this month", formatCurrency(sales._sum.total?.toNumber() || 0)],
    ["Gross profit", formatCurrency(grossProfit)],
    ["Approved expenses", formatCurrency(approvedExpenses)],
    ["Net operating result", formatCurrency(grossProfit - approvedExpenses)],
    ["Completed sales", String(sales._count)],
    ["Phones in stock", String(stock)],
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Reports" description={`Performance since ${startOfMonth.toLocaleDateString("en-ZW")}`} />
      <div className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-6 lg:px-8">
        {cards.map(([label, value]) => <Card key={label}><CardContent className="p-5"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></CardContent></Card>)}
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <Card><CardContent className="p-5"><h2 className="font-semibold">Account balances</h2><div className="mt-3 divide-y divide-slate-100">{accounts.map((account) => <div key={account.id} className="flex justify-between py-3 text-sm"><span>{account.name}</span><span className="font-semibold">{formatCurrency(account.balance.toNumber(), account.currency)}</span></div>)}</div></CardContent></Card>
      </div>
    </div>
  );
}
