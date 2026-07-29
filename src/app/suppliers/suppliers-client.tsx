"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { Search, Plus, Truck } from "lucide-react";
import { createSupplier } from "@/server/actions/suppliers";

interface ItemData { id: string; name?: string; phone?: string; email?: string | null; createdAt?: Date; }
export function SuppliersClient({ items }: { items: ItemData[] }) {
  const [search, setSearch] = useState(""); const [open, setOpen] = useState(false); const [saving, setSaving] = useState(false); const { showToast } = useToast();
  const filtered = items.filter((item) => `${item.name} ${item.phone}`.toLowerCase().includes(search.toLowerCase()));
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); const result = await createSupplier(new FormData(event.currentTarget)); setSaving(false); if (result.success) { showToast("Supplier created", "success"); setOpen(false); event.currentTarget.reset(); } else showToast(result.error || "Unable to create supplier", "error"); }
  return <div className="space-y-4"><PageHeader title="Suppliers" description="Manage supplier relationships and purchases" actions={<Button onClick={() => setOpen(!open)} className="h-10"><Plus className="h-4 w-4 mr-2" />New Supplier</Button>} />
    <div className="px-4 sm:px-6 lg:px-8 space-y-4">{open && <Card className="border-emerald-200"><CardContent className="p-4"><form onSubmit={submit} className="grid gap-3 sm:grid-cols-2"><Field name="name" label="Supplier name" required /><Field name="phone" label="Phone" required /><Field name="contactPerson" label="Contact person" /><Field name="email" label="Email" type="email" /><Field name="whatsapp" label="WhatsApp" /><Field name="address" label="Address" /><div className="sm:col-span-2 flex gap-2"><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save supplier"}</Button><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button></div></form></CardContent></Card>}
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suppliers..." className="pl-9 h-11" /></div>
      {filtered.length === 0 ? <div className="text-center py-16"><Truck className="h-16 w-16 text-slate-300 mx-auto mb-4" /><h3 className="text-base font-semibold text-slate-900 mb-1">No suppliers yet</h3><p className="text-sm text-slate-500">Create your first supplier to get started.</p></div> : <div className="space-y-2">{filtered.map((item) => <Card key={item.id}><CardContent className="p-4"><p className="font-semibold text-slate-900">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.phone}{item.email ? ` · ${item.email}` : ""}</p></CardContent></Card>)}</div>}</div></div>;
}
function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) { return <div className="space-y-1"><Label htmlFor={name}>{label}{required ? " *" : ""}</Label><Input id={name} name={name} type={type} required={required} /></div>; }
