"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  ShoppingCart,
  Truck,
  Wrench,
  TestTube,
  History,
  Tag,
  Smartphone,
} from "lucide-react";

interface ProductData {
  id: string;
  stockNumber: string;
  productName: string;
  brand: string | null;
  model: string | null;
  colour: string | null;
  storageCapacity: string | null;
  ram: string | null;
  simConfig: string | null;
  networkStatus: string | null;
  condition: string | null;
  grade: string | null;
  status: string;
  branch: string | null;
  location: string | null;
  shelfLocation: string | null;
  boxIncluded: boolean;
  chargerIncluded: boolean;
  warrantyPeriod: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  identifiers: { type: string; value: string }[];
  prices: { type: string; amount: number; currency: string }[];
  acquisition: {
    type: string;
    sourceName: string | null;
    supplierName: string | null;
    purchaseDate: Date;
    costs: { type: string; amount: number; currency: string }[];
  } | null;
  tests: {
    id: string;
    outcome: string;
    technicianNotes: string | null;
    finalGrade: string | null;
    testDate: Date;
    issues: { category: string; issue: string; severity: string | null }[];
  }[];
  repairs: {
    id: string;
    reportedFault: string;
    status: string;
    totalCost: number;
    createdAt: Date;
  }[];
  movements: {
    type: string;
    fromLocation: string | null;
    toLocation: string | null;
    createdAt: Date;
  }[];
  warranty: { startDate: Date; expiryDate: Date; terms: string | null } | null;
  reservation: { status: string; expiryDate: Date } | null;
}

type TabId = "overview" | "pricing" | "testing" | "repairs" | "history" | "movements";

const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: Smartphone },
  { id: "pricing", label: "Pricing", icon: Tag },
  { id: "testing", label: "Testing", icon: TestTube },
  { id: "repairs", label: "Repairs", icon: Wrench },
  { id: "history", label: "History", icon: History },
  { id: "movements", label: "Movements", icon: Truck },
];

export function ProductDetailsClient({ product }: { product: ProductData }) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const cashPrice = product.prices.find((p) => p.type === "CASH");
  const wholesalePrice = product.prices.find((p) => p.type === "WHOLESALE");
  const instalmentPrice = product.prices.find((p) => p.type === "INSTALMENT");
  const minimumPrice = product.prices.find((p) => p.type === "MINIMUM");

  const imei1 = product.identifiers.find((i) => i.type === "IMEI_1");
  const imei2 = product.identifiers.find((i) => i.type === "IMEI_2");
  const serial = product.identifiers.find((i) => i.type === "SERIAL");

  const totalCost = product.acquisition?.costs.reduce((sum, c) => sum + c.amount, 0) || 0;
  const expectedProfit = cashPrice ? cashPrice.amount - totalCost : null;
  const margin = cashPrice && cashPrice.amount > 0 ? ((cashPrice.amount - totalCost) / cashPrice.amount) * 100 : null;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link href="/inventory" className="text-slate-500 hover:text-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-slate-900 truncate">
              {product.productName}
            </h1>
            <p className="text-xs text-slate-500">{product.stockNumber}</p>
          </div>
          <StatusBadge status={product.status} />
        </div>
      </div>

      {/* Mobile Sticky Actions */}
      <div className="sticky top-14 bg-white border-b border-slate-200 z-10 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {product.status === "IN_STOCK" && (
            <>
              <Link href={`/pos?item=${product.id}`}>
                <Button size="sm" variant="success">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Sell
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="px-4 py-4 space-y-4">
          {/* Main Info Card */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-center h-32 bg-slate-100 rounded-lg mb-2">
                <Smartphone className="h-16 w-16 text-slate-400" />
              </div>
              <DetailRow label="Brand" value={product.brand} />
              <DetailRow label="Model" value={product.model} />
              <DetailRow label="Colour" value={product.colour} />
              <DetailRow label="Storage" value={product.storageCapacity} />
              <DetailRow label="RAM" value={product.ram} />
              <DetailRow label="SIM" value={product.simConfig} />
              <DetailRow label="Network" value={product.networkStatus} />
              <DetailRow label="Condition" value={product.condition} />
              <DetailRow label="Grade" value={product.grade} />
            </CardContent>
          </Card>

          {/* Identifiers Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Identifiers</h3>
              <div className="space-y-2">
                <DetailRow label="IMEI 1" value={imei1?.value} mono />
                <DetailRow label="IMEI 2" value={imei2?.value} mono />
                <DetailRow label="Serial" value={serial?.value} mono />
                <DetailRow label="Stock No." value={product.stockNumber} mono />
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Location</h3>
              <DetailRow label="Branch" value={product.branch} />
              <DetailRow label="Shelf" value={product.shelfLocation} />
              <DetailRow label="Box" value={product.boxIncluded ? "Yes" : "No"} />
              <DetailRow label="Charger" value={product.chargerIncluded ? "Yes" : "No"} />
            </CardContent>
          </Card>

          {product.notes && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Notes</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{product.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === "pricing" && (
        <div className="px-4 py-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Selling Prices</h3>
              <div className="space-y-3">
                {cashPrice && (
                  <PriceRow label="Cash Price" amount={cashPrice.amount} primary />
                )}
                {wholesalePrice && (
                  <PriceRow label="Wholesale Price" amount={wholesalePrice.amount} />
                )}
                {instalmentPrice && (
                  <PriceRow label="Instalment Price" amount={instalmentPrice.amount} />
                )}
                {minimumPrice && (
                  <PriceRow label="Minimum Price" amount={minimumPrice.amount} />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Cost Breakdown</h3>
              <div className="space-y-2">
                {product.acquisition?.costs.map((cost, idx) => (
                  <DetailRow key={idx} label={cost.type.replace(/_/g, " ")} value={formatCurrency(cost.amount)} />
                ))}
                <div className="pt-2 border-t border-slate-100">
                  <DetailRow label="Total Landed Cost" value={formatCurrency(totalCost)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {product.acquisition && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Acquisition</h3>
                <DetailRow label="Source" value={product.acquisition.sourceName || product.acquisition.supplierName} />
                <DetailRow label="Date" value={formatDate(product.acquisition.purchaseDate)} />
                <DetailRow label="Type" value={product.acquisition.type.replace(/_/g, " ")} />
              </CardContent>
            </Card>
          )}

          {expectedProfit !== null && (
            <Card className={`border ${expectedProfit >= 0 ? "border-emerald-200" : "border-red-200"}`}>
              <CardContent className={`p-4 ${expectedProfit >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
                <h3 className="text-sm font-semibold mb-2">Profit Analysis</h3>
                <DetailRow label="Expected Profit" value={formatCurrency(expectedProfit)} />
                <DetailRow label="Margin" value={margin !== null ? `${margin.toFixed(1)}%` : "—"} />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Testing Tab */}
      {activeTab === "testing" && (
        <div className="px-4 py-4 space-y-4">
          {product.tests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <TestTube className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No test records</p>
              </CardContent>
            </Card>
          ) : (
            product.tests.map((test) => (
              <Card key={test.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{formatDate(test.testDate)}</span>
                    <StatusBadge status={test.outcome} />
                  </div>
                  {test.finalGrade && <DetailRow label="Final Grade" value={test.finalGrade} />}
                  {test.technicianNotes && (
                    <p className="text-sm text-slate-600">{test.technicianNotes}</p>
                  )}
                  {test.issues.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">Issues:</p>
                      {test.issues.map((issue, idx) => (
                        <span key={idx} className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700 mr-1 mb-1">
                          {issue.issue}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Repairs Tab */}
      {activeTab === "repairs" && (
        <div className="px-4 py-4 space-y-4">
          {product.repairs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No repair records</p>
              </CardContent>
            </Card>
          ) : (
            product.repairs.map((repair) => (
              <Card key={repair.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{formatDate(repair.createdAt)}</span>
                    <StatusBadge status={repair.status} />
                  </div>
                  <DetailRow label="Fault" value={repair.reportedFault} />
                  <DetailRow label="Cost" value={formatCurrency(repair.totalCost)} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="px-4 py-4 space-y-4">
          {product.warranty && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Warranty</h3>
                <DetailRow label="Start" value={formatDate(product.warranty.startDate)} />
                <DetailRow label="Expiry" value={formatDate(product.warranty.expiryDate)} />
                <DetailRow label="Terms" value={product.warranty.terms} />
              </CardContent>
            </Card>
          )}

          {product.reservation && (
            <Card className="border-amber-200">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-amber-800 mb-3">Reservation</h3>
                <DetailRow label="Status" value={product.reservation.status} />
                <DetailRow label="Expires" value={formatDate(product.reservation.expiryDate)} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Timeline</h3>
              <DetailRow label="Created" value={formatDateTime(product.createdAt)} />
              <DetailRow label="Last Updated" value={formatDateTime(product.updatedAt)} />
              {product.acquisition && (
                <DetailRow label="Acquired" value={formatDate(product.acquisition.purchaseDate)} />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Movements Tab */}
      {activeTab === "movements" && (
        <div className="px-4 py-4 space-y-4">
          {product.movements.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Truck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No stock movements</p>
              </CardContent>
            </Card>
          ) : (
            product.movements.map((movement, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-emerald-600 mt-2" />
                  {idx < product.movements.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-1" />}
                </div>
                <Card className="flex-1">
                  <CardContent className="p-3">
                    <p className="text-sm font-medium text-slate-900 capitalize">{movement.type.toLowerCase()}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {movement.fromLocation && `From: ${movement.fromLocation}`}
                      {movement.toLocation && ` → ${movement.toLocation}`}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(movement.createdAt)}</p>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string | null | undefined; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm text-slate-900 ${mono ? "font-mono" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}

function PriceRow({ label, amount, primary }: { label: string; amount: number; primary?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`${primary ? "text-lg font-bold text-slate-900" : "text-sm font-medium text-slate-900"}`}>
        {formatCurrency(amount)}
      </span>
    </div>
  );
}
