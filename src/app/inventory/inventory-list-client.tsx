"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search,
  Plus,
  Package,
  Smartphone,
  SlidersHorizontal,
} from "lucide-react";

interface InventoryItemData {
  id: string;
  stockNumber: string;
  productName: string;
  brand: string | null;
  model: string | null;
  colour: string | null;
  storage: string | null;
  status: string;
  condition: string | null;
  branch: string | null;
  cashPrice: number | null;
  cost: number | null;
  imei: string | null;
  createdAt: Date;
}

interface AccessoryData {
  id: string;
  sku: string | null;
  productName: string;
  brand: string | null;
  model: string | null;
  quantity: number;
  unitCost: number | null;
  sellingPrice: number | null;
  branch: string | null;
}

interface InventoryProps {
  data: {
    items: InventoryItemData[];
    accessories: AccessoryData[];
  };
}

export function InventoryListClient({ data }: InventoryProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"phones" | "accessories">("phones");

  const filteredItems = data.items.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.productName.toLowerCase().includes(q) ||
      item.stockNumber.toLowerCase().includes(q) ||
      (item.imei && item.imei.includes(q)) ||
      (item.brand?.toLowerCase().includes(q)) ||
      (item.model?.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Inventory"
        description={`${data.items.length} phones · ${data.accessories.length} accessories`}
        actions={
          <Link href="/inventory/receive">
            <Button className="h-10">
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          </Link>
        }
      />

      {/* Search & Filter Bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, IMEI, brand..."
              className="pl-9 h-11"
            />
          </div>
          <Button variant="outline" className="h-11 px-3">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("phones")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "phones"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            Phones
            <span className="text-xs text-gray-400">({data.items.length})</span>
          </button>
          <button
            onClick={() => setViewMode("accessories")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === "accessories"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package className="h-4 w-4" />
            Accessories
            <span className="text-xs text-gray-400">({data.accessories.length})</span>
          </button>
        </div>
      </div>

      {/* Phone Inventory - Mobile Cards */}
      {viewMode === "phones" && (
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">IMEI / Stock</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Branch</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                        No phones found.{" "}
                        <Link href="/inventory/receive" className="text-blue-600 hover:underline">
                          Receive your first phone
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link href={`/inventory/${item.id}`} className="block">
                            <p className="text-sm font-medium text-gray-900">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {[item.brand, item.model, item.storage, item.colour]
                                .filter(Boolean)
                                .join(" · ") || "—"}
                            </p>
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-mono text-gray-600">
                            {item.imei || "—"}
                          </p>
                          <p className="text-xs text-gray-400">{item.stockNumber}</p>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.branch || "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {item.cashPrice ? formatCurrency(item.cashPrice) : "—"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-gray-500">
                          {formatDate(item.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No phones found</p>
                <Link href="/inventory/receive">
                  <Button variant="link" className="mt-1">
                    Receive your first phone
                  </Button>
                </Link>
              </div>
            ) : (
              filteredItems.map((item) => (
                <Link key={item.id} href={`/inventory/${item.id}`}>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 active:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {[item.brand, item.model, item.storage, item.colour]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-mono">{item.imei || item.stockNumber}</span>
                      <span className="font-semibold text-gray-900">
                        {item.cashPrice ? formatCurrency(item.cashPrice) : "—"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      {/* Accessory View */}
      {viewMode === "accessories" && (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="lg:hidden space-y-2">
            {data.accessories.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No accessories yet</p>
              </div>
            ) : (
              data.accessories.map((acc) => (
                <div
                  key={acc.id}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {acc.productName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {[acc.brand, acc.model, acc.sku].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Qty: {acc.quantity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{acc.branch || "—"}</span>
                    <span className="font-semibold text-gray-900">
                      {acc.sellingPrice ? formatCurrency(acc.sellingPrice) : "—"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Accessory Table */}
          <div className="hidden lg:block">
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Selling Price</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {data.accessories.map((acc) => (
                    <tr key={acc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{acc.productName}</p>
                        <p className="text-xs text-gray-500">{[acc.brand, acc.model].filter(Boolean).join(" · ")}</p>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-600">{acc.sku || "—"}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold">{acc.quantity}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        {acc.unitCost ? formatCurrency(acc.unitCost) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        {acc.sellingPrice ? formatCurrency(acc.sellingPrice) : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{acc.branch || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
