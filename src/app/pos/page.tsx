"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { completeSale, getSellableInventory } from "@/server/actions/transactions";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Search, ShoppingCart, ScanLine, User, Trash2, Check } from "lucide-react";
import Link from "next/link";
import { paymentMethods, type PaymentMethodCode } from "@/lib/sales";

export default function POSPage() {
  const [items, setItems] = useState<{ id?: string; name: string; price: number; qty: number }[]>([]);
  const [inventory, setInventory] = useState<{ id: string; name: string; search: string; price: number }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodCode>("CASH");
  const router = useRouter(); const { showToast } = useToast(); const [saving, setSaving] = useState(false);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const matchingInventory = inventory.filter((item) =>
    item.search.toLowerCase().includes(search.trim().toLowerCase())
  );

  useEffect(() => { getSellableInventory().then(setInventory).catch(() => showToast("Unable to load inventory", "error")); }, [showToast]);

  function addItem(item: { id: string; name: string; price: number }) {
    if (!item.price) { showToast("Set a cash price before selling this item", "error"); return; }
    if (items.some((cartItem) => cartItem.id === item.id)) return;
    setItems([...items, { ...item, qty: 1 }]);
  }
  async function finishSale() { setSaving(true); const result = await completeSale({ items: items.map((item) => ({ id: item.id, qty: 1 })), paymentMethod: selectedPayment }); setSaving(false); if (result.success) { showToast("Sale completed", "success"); setItems([]); router.push(`/invoices/${result.invoiceId}`); } else showToast(result.error || "Sale failed", "error"); }

  return (
    <div className="space-y-4 pb-24">
      <PageHeader title="Point of Sale" description="Quick sell interface" />

      <div className="px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Search/Scan */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Scan IMEI or search product..."
              className="pl-9 h-12 text-base"
            />
          </div>
          <Link href="/scan" aria-label="Scan IMEI" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
            <ScanLine className="h-5 w-5" />
          </Link>
        </div>

        <div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2" aria-label="Sellable inventory">
          {matchingInventory.map((item) => <button type="button" key={item.id} onClick={() => addItem(item)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"><span className="min-w-0 truncate text-sm font-medium">{item.name}</span><span className="shrink-0 text-sm font-semibold">{formatCurrency(item.price)}</span></button>)}
          {inventory.length === 0 && <p className="p-3 text-center text-sm text-slate-500">No sellable stock available.</p>}
          {inventory.length > 0 && matchingInventory.length === 0 && <p className="p-3 text-center text-sm text-slate-500">No products match “{search}”.</p>}
        </div>

        {/* Cart */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Cart ({items.length})</h3>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Cart is empty</p>
                <p className="text-xs text-slate-400 mt-1">Search or scan a product to add</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">x{item.qty} · {formatCurrency(item.price)}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 mr-3">
                    {formatCurrency(item.price * item.qty)}
                  </span>
                  <button type="button" onClick={() => setItems(items.filter((cartItem) => cartItem.id !== item.id))} aria-label={`Remove ${item.name} from cart`} className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}

            {items.length > 0 && (
              <>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-xl font-bold text-slate-900">{formatCurrency(total)}</span>
                </div>

                {/* Payment Method */}
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">Payment Method</p>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((pm) => (
                      <button
                        type="button"
                        key={pm.code}
                        onClick={() => setSelectedPayment(pm.code)}
                        aria-pressed={selectedPayment === pm.code}
                        className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                          selectedPayment === pm.code
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer */}
                <Link href="/customers" className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-600 transition-colors hover:border-emerald-400 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                  <User className="h-4 w-4" />
                  Manage customers
                </Link>

                <Button onClick={finishSale} disabled={saving} className="w-full h-12 text-base">
                  <Check className="h-5 w-5 mr-2" />
                  {saving ? "Completing…" : `Complete Sale — ${formatCurrency(total)}`}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
