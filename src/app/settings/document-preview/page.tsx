import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { formatCurrency } from "@/lib/utils";
import { PrintButton } from "@/app/invoices/[id]/print-button";

export const dynamic = "force-dynamic";

export default async function DocumentPreviewPage() {
  const tenant = await getCurrentTenant();
  const company = await prisma.organisation.findUniqueOrThrow({
    where: { id: tenant.organisationId },
  });
  const hasDetails = Boolean(company.address && company.phone && company.email);

  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-8 print:p-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/settings" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"><ArrowLeft className="h-4 w-4" />Company settings</Link>
        <PrintButton />
      </div>
      <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 print:hidden">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
        <div><p className="font-semibold text-emerald-950">Document branding check</p><p className="mt-1 text-sm text-emerald-900">{hasDetails ? "Your company profile is ready to test. Choose Print / Save PDF, then check the logo, contacts, totals, and footer in the saved file." : "Some company contact details are missing. You can still print this preview, then return to Company settings to complete the profile."}</p></div>
      </div>
      <article className="rounded-xl border border-slate-200 bg-white p-6 sm:p-10 print:border-0 print:p-0">
        <header className="flex justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex min-w-0 items-start gap-4"><img src="/logo.jpg" alt="TSM Mobiles logo" className="h-20 w-20 shrink-0 rounded-lg object-cover print:h-16 print:w-16" /><div className="min-w-0"><h1 className="text-2xl font-bold text-slate-900">{company.name}</h1><p className="mt-1 whitespace-pre-line text-sm text-slate-600">{company.address || "Company address"}</p><p className="text-sm text-slate-600">{company.phone || "Phone"}{company.email ? ` · ${company.email}` : ""}</p>{company.taxId && <p className="text-sm text-slate-600">Tax ID: {company.taxId}</p>}</div></div>
          <div className="shrink-0 text-right"><h2 className="text-xl font-bold tracking-wide text-slate-900">INVOICE</h2><p className="mt-2 font-semibold">{company.invoicePrefix}-PREVIEW</p><p className="text-sm text-slate-600">Document smoke test</p></div>
        </header>
        <section className="py-6"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bill to</p><p className="mt-1 font-semibold text-slate-900">Sample customer</p><p className="text-sm text-slate-600">This content is only for checking your PDF layout.</p></section>
        <table className="w-full border-collapse text-sm"><thead><tr className="border-y border-slate-200 text-left text-slate-500"><th className="py-3">Description</th><th className="py-3 text-right">Qty</th><th className="py-3 text-right">Price</th><th className="py-3 text-right">Total</th></tr></thead><tbody><tr className="border-b border-slate-100"><td className="py-3">Sample smartphone</td><td className="py-3 text-right">1</td><td className="py-3 text-right">{formatCurrency(150, company.defaultCurrency)}</td><td className="py-3 text-right font-medium">{formatCurrency(150, company.defaultCurrency)}</td></tr></tbody></table>
        <section className="ml-auto mt-6 max-w-xs space-y-2 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(150, company.defaultCurrency)}</span></div><div className="flex justify-between"><span>Discount</span><span>{formatCurrency(0, company.defaultCurrency)}</span></div><div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold"><span>Total</span><span>{formatCurrency(150, company.defaultCurrency)}</span></div></section>
        {(company.defaultPaymentTerms || company.warrantyTerms || company.receiptFooter) && <footer className="mt-10 border-t border-slate-200 pt-5 text-xs text-slate-600"><p className="font-semibold text-slate-700">Payment terms</p><p>{company.defaultPaymentTerms}</p><p className="mt-3 whitespace-pre-line">{company.warrantyTerms}</p><p className="mt-3 whitespace-pre-line">{company.receiptFooter}</p></footer>}
      </article>
    </main>
  );
}
