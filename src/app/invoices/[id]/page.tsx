import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PrintButton } from "./print-button";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const tenant = await getCurrentTenant();
  const invoice = await prisma.invoice.findFirst({
    where: { id: params.id, organisationId: tenant.organisationId },
    include: { customer: true, items: true, organisation: true, branch: true },
  });
  if (!invoice) notFound();
  const company = invoice.organisation;
  return <main className="mx-auto max-w-4xl p-4 sm:p-8 print:p-0">
    <div className="mb-4 flex justify-end print:hidden"><PrintButton /></div>
    <article className="rounded-xl border border-slate-200 bg-white p-6 sm:p-10 print:border-0 print:p-0">
      <header className="flex justify-between gap-6 border-b border-slate-200 pb-6"><div><h1 className="text-2xl font-bold text-slate-900">{company.name}</h1><p className="mt-1 whitespace-pre-line text-sm text-slate-600">{company.address}</p><p className="text-sm text-slate-600">{company.phone} {company.email ? `· ${company.email}` : ""}</p>{company.taxId && <p className="text-sm text-slate-600">Tax ID: {company.taxId}</p>}</div><div className="text-right"><h2 className="text-xl font-bold tracking-wide text-slate-900">INVOICE</h2><p className="mt-2 font-semibold">{invoice.invoiceNumber}</p><p className="text-sm text-slate-600">Date: {formatDate(invoice.date)}</p>{invoice.dueDate && <p className="text-sm text-slate-600">Due: {formatDate(invoice.dueDate)}</p>}</div></header>
      <section className="py-6"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bill to</p><p className="mt-1 font-semibold text-slate-900">{invoice.customer?.name || "Walk-in customer"}</p>{invoice.customer?.phone && <p className="text-sm text-slate-600">{invoice.customer.phone}</p>}</section>
      <table className="w-full border-collapse text-sm"><thead><tr className="border-y border-slate-200 text-left text-slate-500"><th className="py-3">Description</th><th className="py-3 text-right">Qty</th><th className="py-3 text-right">Price</th><th className="py-3 text-right">Total</th></tr></thead><tbody>{invoice.items.map((item) => <tr key={item.id} className="border-b border-slate-100"><td className="py-3">{item.description}{item.imei && <span className="block text-xs text-slate-500">IMEI: {item.imei}</span>}</td><td className="py-3 text-right">{item.quantity}</td><td className="py-3 text-right">{formatCurrency(item.unitPrice.toNumber(), invoice.currency)}</td><td className="py-3 text-right font-medium">{formatCurrency(item.total.toNumber(), invoice.currency)}</td></tr>)}</tbody></table>
      <section className="ml-auto mt-6 max-w-xs space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal.toNumber(), invoice.currency)}</span></div><div className="flex justify-between"><span>Discount</span><span>{formatCurrency(invoice.discount?.toNumber() || 0, invoice.currency)}</span></div><div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold"><span>Total</span><span>{formatCurrency(invoice.total.toNumber(), invoice.currency)}</span></div></section>
      {(invoice.paymentTerms || company.receiptFooter || invoice.warrantyTerms || company.warrantyTerms) && <footer className="mt-10 border-t border-slate-200 pt-5 text-xs text-slate-600"><p className="font-semibold text-slate-700">Payment terms</p><p>{invoice.paymentTerms || company.defaultPaymentTerms}</p><p className="mt-3 whitespace-pre-line">{invoice.warrantyTerms || company.warrantyTerms}</p><p className="mt-3 whitespace-pre-line">{company.receiptFooter}</p></footer>}
    </article>
  </main>;
}
