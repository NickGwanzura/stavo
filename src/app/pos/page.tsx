"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Search, ShoppingCart, ScanLine, User, Trash2, Check } from "lucide-react";

const paymentMethods = [
  "Cash", "EcoCash", "OneMoney", "InnBucks", "ZIPIT",
  "Bank Transfer", "Swipe", "Visa/Mastercard", "Customer Credit",
];

export default function POSPage() {
  const [items, setItems] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("Cash");

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  function addDemoItem() {
    setItems([...items, { id: Date.now().toString(), name: "Demo Phone", price: 150, qty: 1 }]);
  }

  return (
    <div className="space-y-4 pb-24">
      <PageHeader title="Point of Sale" description="Quick sell interface" />

      <div className="px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Search/Scan */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Scan IMEI or search product..."
              className="pl-9 h-12 text-base"
            />
          </div>
          <Button variant="outline" className="h-12 px-4">
            <ScanLine className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick add demo item */}
        <Button onClick={addDemoItem} variant="outline" className="w-full h-12">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add Item
        </Button>

        {/* Cart */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Cart ({items.length})</h3>

            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">Search or scan a product to add</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">x{item.qty} · {formatCurrency(item.price)}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 mr-3">
                    {formatCurrency(item.price * item.qty)}
                  </span>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}

            {items.length > 0 && (
              <>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(total)}</span>
                </div>

                {/* Payment Method */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Payment Method</p>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm}
                        onClick={() => setSelectedPayment(pm)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          selectedPayment === pm
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer */}
                <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400">
                  <User className="h-4 w-4" />
                  Add Customer (optional)
                </button>

                <Button className="w-full h-12 text-base">
                  <Check className="h-5 w-5 mr-2" />
                  Complete Sale — {formatCurrency(total)}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
