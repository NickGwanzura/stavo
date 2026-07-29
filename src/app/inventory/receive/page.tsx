"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { receiveCellphone } from "@/server/actions/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { validateIMEI } from "@/lib/imei";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Camera,
  Package,
  DollarSign,
  Tag,
  Image,
  FileText,
} from "lucide-react";

type Step = {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
};

const steps: Step[] = [
  { id: 1, title: "Type", icon: Package },
  { id: 2, title: "Details", icon: FileText },
  { id: 3, title: "IMEI", icon: Camera },
  { id: 4, title: "Costs", icon: DollarSign },
  { id: 5, title: "Pricing", icon: Tag },
  { id: 6, title: "Photos", icon: Image },
  { id: 7, title: "Confirm", icon: Check },
];

const acquisitionTypes = [
  { value: "PURCHASED_FROM_SUPPLIER", label: "Purchased from Supplier" },
  { value: "BOUGHT_FROM_INDIVIDUAL", label: "Bought from Individual" },
  { value: "CUSTOMER_TRADE_IN", label: "Customer Trade-In" },
  { value: "IMPORTED_STOCK", label: "Imported Stock" },
  { value: "BRANCH_TRANSFER", label: "Branch Transfer" },
  { value: "OWNER_SUPPLIED", label: "Owner-Supplied" },
  { value: "OPENING_STOCK", label: "Opening Stock" },
];

const conditions = [
  "New Sealed", "New Open Box", "Like New", "Excellent", "Good", "Fair", "Poor", "For Repair", "For Parts",
];

const brands = ["Apple", "Samsung", "Huawei", "Xiaomi", "Tecno", "Infinix", "Nokia", "Oppo", "Vivo", "Sony"];

export default function ReceiveInventoryPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imei1, setImei1] = useState("");
  const [imei2, setImei2] = useState("");
  const [imei1Valid, setImei1Valid] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<Record<string, string | boolean | number>>({
    acquisitionType: "PURCHASED_FROM_SUPPLIER",
    condition: "Good",
    brand: "",
    model: "",
    colour: "",
    storageCapacity: "",
    ram: "",
    simConfig: "Dual SIM",
    networkStatus: "Unlocked",
    boxIncluded: true,
    chargerIncluded: true,
    warrantyPeriod: 14,
    currency: "USD",
    purchasePrice: 0,
    cashPrice: 0,
  });

  function updateField(key: string, value: string | boolean | number) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleImei1Change(value: string) {
    setImei1(value);
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 15) {
      setImei1Valid(validateIMEI(cleaned));
    } else {
      setImei1Valid(null);
    }
  }

  function handleImei2Change(value: string) {
    setImei2(value);
  }

  function canProceed(): boolean {
    switch (currentStep) {
      case 0: return !!formData.acquisitionType;
      case 2: return imei1.length === 0 || imei1Valid === true;
      default: return true;
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("organisationId", "org-placeholder");
      fd.append("branchId", "branch-placeholder");
      fd.append("acquisitionType", formData.acquisitionType as string);
      fd.append("brandId", formData.brand as string);
      fd.append("productName", `${formData.brand || "Phone"} ${formData.model || ""}`.trim());
      fd.append("colour", formData.colour as string);
      fd.append("storageCapacity", formData.storageCapacity as string);
      fd.append("ram", formData.ram as string);
      fd.append("simConfig", formData.simConfig as string);
      fd.append("networkStatus", formData.networkStatus as string);
      fd.append("condition", formData.condition as string);
      fd.append("boxIncluded", String(formData.boxIncluded));
      fd.append("chargerIncluded", String(formData.chargerIncluded));
      fd.append("warrantyPeriod", String(formData.warrantyPeriod));
      fd.append("currency", formData.currency as string);
      fd.append("purchasePrice", String(formData.purchasePrice));
      fd.append("cashPrice", String(formData.cashPrice));
      fd.append("imei1", imei1);
      fd.append("imei2", imei2);

      const result = await receiveCellphone(fd);

      if (result.success) {
        router.push(`/inventory/${result.data.id}`);
      } else {
        setError(result.error);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function nextStep() {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  }

  function prevStep() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Receive Phone" description="Add a new cellphone to inventory" />

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Step Progress */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
          {steps.map((step, idx) => {
            const isActive = idx === currentStep;
            const isDone = idx < currentStep;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isDone
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <step.icon className="h-3.5 w-3.5" />
                {step.title}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Acquisition Type */}
        {currentStep === 0 && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label>Acquisition Type</Label>
              <div className="grid grid-cols-1 gap-2">
                {acquisitionTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => updateField("acquisitionType", type.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.acquisitionType === type.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Product Details */}
        {currentStep === 1 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label>Brand</Label>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => updateField("brand", b)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                        formData.brand === b
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model as string}
                  onChange={(e) => updateField("model", e.target.value)}
                  placeholder="e.g. iPhone 15 Pro Max"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="colour">Colour</Label>
                  <Input
                    id="colour"
                    value={formData.colour as string}
                    onChange={(e) => updateField("colour", e.target.value)}
                    placeholder="e.g. Space Black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage">Storage</Label>
                  <Input
                    id="storage"
                    value={formData.storageCapacity as string}
                    onChange={(e) => updateField("storageCapacity", e.target.value)}
                    placeholder="e.g. 256GB"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="ram">RAM</Label>
                  <Input
                    id="ram"
                    value={formData.ram as string}
                    onChange={(e) => updateField("ram", e.target.value)}
                    placeholder="e.g. 8GB"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sim">SIM Config</Label>
                  <select
                    id="sim"
                    value={formData.simConfig as string}
                    onChange={(e) => updateField("simConfig", e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option>Single SIM</option>
                    <option>Dual SIM</option>
                    <option>eSIM</option>
                    <option>Dual SIM + eSIM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="network">Network Status</Label>
                  <select
                    id="network"
                    value={formData.networkStatus as string}
                    onChange={(e) => updateField("networkStatus", e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option>Unlocked</option>
                    <option>Network Locked</option>
                    <option>Unknown</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <select
                    id="condition"
                    value={formData.condition as string}
                    onChange={(e) => updateField("condition", e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    {conditions.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.boxIncluded as boolean}
                    onChange={(e) => updateField("boxIncluded", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Box Included
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.chargerIncluded as boolean}
                    onChange={(e) => updateField("chargerIncluded", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Charger Included
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty (days)</Label>
                <Input
                  id="warranty"
                  type="number"
                  value={formData.warrantyPeriod as number}
                  onChange={(e) => updateField("warrantyPeriod", parseInt(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: IMEI */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imei1">IMEI 1</Label>
                <Input
                  id="imei1"
                  value={imei1}
                  onChange={(e) => handleImei1Change(e.target.value)}
                  placeholder="15-digit IMEI number"
                  className="font-mono text-lg tracking-wider"
                  maxLength={15}
                />
                {imei1Valid === true && (
                  <p className="text-xs text-green-600">✓ Valid IMEI</p>
                )}
                {imei1Valid === false && (
                  <p className="text-xs text-red-600">✗ Invalid IMEI (Luhn check failed)</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imei2">IMEI 2 (optional)</Label>
                <Input
                  id="imei2"
                  value={imei2}
                  onChange={(e) => handleImei2Change(e.target.value)}
                  placeholder="Second IMEI for dual SIM"
                  className="font-mono"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serial">Serial Number (optional)</Label>
                <Input
                  id="serial"
                  placeholder="Device serial number"
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Costs */}
        {currentStep === 3 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price (USD)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice as number}
                    onChange={(e) => updateField("purchasePrice", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping">Shipping</Label>
                  <Input
                    id="shipping"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="customs">Customs / Duty</Label>
                  <Input
                    id="customs"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transport">Transport</Label>
                  <Input
                    id="transport"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-600">
                  Landed Cost:{" "}
                  <span className="font-bold text-gray-900">
                    ${(formData.purchasePrice as number).toFixed(2)}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Pricing */}
        {currentStep === 4 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cashPrice">Cash Price (USD)</Label>
                <Input
                  id="cashPrice"
                  type="number"
                  step="0.01"
                  value={formData.cashPrice as number}
                  onChange={(e) => updateField("cashPrice", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="wholesale">Wholesale Price</Label>
                  <Input id="wholesale" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instalment">Instalment Price</Label>
                  <Input id="instalment" type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimum">Minimum Price</Label>
                <Input id="minimum" type="number" step="0.01" placeholder="0.00" />
              </div>
              {formData.cashPrice as number > 0 && formData.purchasePrice as number > 0 && (
                <div className="rounded-lg bg-green-50 p-3">
                  <p className="text-sm text-green-700">
                    Expected Gross Profit:{" "}
                    <span className="font-bold">
                      ${((formData.cashPrice as number) - (formData.purchasePrice as number)).toFixed(2)}
                    </span>
                    {" | "}
                    Margin:{" "}
                    <span className="font-bold">
                      {((((formData.cashPrice as number) - (formData.purchasePrice as number)) / (formData.cashPrice as number)) * 100).toFixed(1)}%
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 6: Photos */}
        {currentStep === 5 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <p className="text-sm text-gray-600">
                Take photos of the device, IMEI, box, and accessories.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <button
                    key={i}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <Camera className="h-8 w-8" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Photos can also be added later from the product page.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 7: Confirmation */}
        {currentStep === 6 && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-900">Review & Confirm</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium">{formData.acquisitionType as string}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-medium">{formData.brand || "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Model</span>
                  <span className="font-medium">{formData.model || "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">IMEI 1</span>
                  <span className="font-mono font-medium">{imei1 || "—"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Purchase Price</span>
                  <span className="font-medium">${(formData.purchasePrice as number).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Cash Price</span>
                  <span className="font-medium">${(formData.cashPrice as number).toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-12 text-base"
              >
                {isSubmitting ? "Receiving..." : "Receive into Stock"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-4">
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep} className="flex-1 h-12">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1 h-12"
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
