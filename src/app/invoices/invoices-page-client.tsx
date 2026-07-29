"use client";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: Date;
  total: number;
  status: string;
  amountPaid: number;
  balanceDue: number;
  currency: string;
}

export function InvoicesPageClient({ invoices }: { invoices: InvoiceData[] }) {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoices`}
        actions={
          <Link href="/pos">
            <Button className="h-10">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8">
        {invoices.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-gray-900 mb-1">No invoices yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first invoice from the Point of Sale.</p>
            <Link href="/pos">
              <Button>Create Invoice</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 lg:hidden">
            {invoices.map((inv) => (
              <Link key={inv.id} href={`/invoices/${inv.id}`}>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{inv.invoiceNumber}</p>
                      <p className="text-xs text-gray-500">{inv.customerName}</p>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(inv.date)}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(inv.total)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {invoices.length > 0 && (
          <div className="hidden lg:block rounded-xl border border-gray-200 bg-white overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Invoice</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Balance</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/invoices/${inv.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{inv.customerName}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(inv.date)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">{formatCurrency(inv.total)}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">{inv.balanceDue > 0 ? formatCurrency(inv.balanceDue) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
