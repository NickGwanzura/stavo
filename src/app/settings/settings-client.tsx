"use client";

import { useState } from "react";
import { Building2, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { updateOrganisationSettings } from "@/server/actions/settings";

type Organisation = {
  name: string; address: string | null; phone: string | null; whatsapp: string | null; email: string | null; taxId: string | null;
  invoicePrefix: string; quotationPrefix: string; defaultCurrency: string; defaultPaymentTerms: string | null; receiptFooter: string | null; warrantyTerms: string | null;
};

export function SettingsClient({ organisation }: { organisation: Organisation }) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true);
    const result = await updateOrganisationSettings(new FormData(event.currentTarget));
    setSaving(false);
    showToast(result.success ? "Company settings saved" : result.error || "Unable to save settings", result.success ? "success" : "error");
  }
  return <div className="space-y-4">
    <PageHeader title="Company settings" description="Details used on invoices, quotations, receipts, and warranties" />
    <form onSubmit={save} className="px-4 sm:px-6 lg:px-8 space-y-4 max-w-3xl">
      <Card><CardContent className="p-5 space-y-4"><div className="flex items-center gap-2 text-slate-900 font-semibold"><Building2 className="h-5 w-5 text-emerald-600" />Company details</div>
        <div className="grid sm:grid-cols-2 gap-4"><Field label="Company name" name="name" value={organisation.name} required /><Field label="Email" name="email" value={organisation.email} type="email" /><Field label="Phone" name="phone" value={organisation.phone} /><Field label="WhatsApp" name="whatsapp" value={organisation.whatsapp} /><Field label="Tax ID" name="taxId" value={organisation.taxId} /><Field label="Address" name="address" value={organisation.address} /></div>
      </CardContent></Card>
      <Card><CardContent className="p-5 space-y-4"><h2 className="font-semibold text-slate-900">Document defaults</h2><div className="grid sm:grid-cols-3 gap-4"><Field label="Invoice prefix" name="invoicePrefix" value={organisation.invoicePrefix} required /><Field label="Quotation prefix" name="quotationPrefix" value={organisation.quotationPrefix} required /><Field label="Currency" name="defaultCurrency" value={organisation.defaultCurrency} required /></div><TextField label="Default payment terms" name="defaultPaymentTerms" value={organisation.defaultPaymentTerms} /><TextField label="Receipt / invoice footer" name="receiptFooter" value={organisation.receiptFooter} /><TextField label="Warranty terms" name="warrantyTerms" value={organisation.warrantyTerms} /></CardContent></Card>
      <Button type="submit" disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Saving…" : "Save company settings"}</Button>
    </form>
  </div>;
}
function Field({ label, name, value, type = "text", required = false }: { label: string; name: string; value: string | null; type?: string; required?: boolean }) { return <div className="space-y-1"><Label htmlFor={name}>{label}{required ? " *" : ""}</Label><Input id={name} name={name} type={type} defaultValue={value ?? ""} required={required} /></div>; }
function TextField({ label, name, value }: { label: string; name: string; value: string | null }) { return <div className="space-y-1"><Label htmlFor={name}>{label}</Label><textarea id={name} name={name} defaultValue={value ?? ""} rows={3} className="flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" /></div>; }
