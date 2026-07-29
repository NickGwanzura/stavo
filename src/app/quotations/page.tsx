"use client";
import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { FileText, Plus } from "lucide-react";
import { createQuotation } from "@/server/actions/transactions";
export default function QuotationsPage() { const [open, setOpen] = useState(false); const [saving, setSaving] = useState(false); const { showToast } = useToast(); async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); const data = new FormData(e.currentTarget); setSaving(true); const result = await createQuotation({ description: String(data.get("description")), price: Number(data.get("price")) }); setSaving(false); if (result.success) { showToast("Quotation created", "success"); setOpen(false); e.currentTarget.reset(); } else showToast(result.error || "Unable to create quotation", "error"); } return <div className="space-y-4"><PageHeader title="Quotations" description="Create and manage customer quotations" actions={<Button onClick={() => setOpen(!open)} className="h-10"><Plus className="h-4 w-4 mr-2" />New Quotation</Button>} /><div className="px-4 sm:px-6 lg:px-8">{open ? <Card><CardContent className="p-4"><form onSubmit={submit} className="space-y-3 max-w-lg"><div><Label>Description</Label><Input name="description" required placeholder="Product or service" /></div><div><Label>Price</Label><Input name="price" type="number" step="0.01" min="0.01" required /></div><Button type="submit" disabled={saving}>{saving ? "Creating…" : "Create quotation"}</Button></form></CardContent></Card> : <div className="text-center py-16"><FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" /><h3 className="text-base font-semibold text-slate-900 mb-1">No quotations yet</h3><Button onClick={() => setOpen(true)} className="mt-4">Create Quotation</Button></div>}</div></div>; }
