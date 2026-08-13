/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateIMEI } from "@/lib/imei";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { useToast } from "@/components/ui/toast";
import { Search, Smartphone, Camera, StopCircle } from "lucide-react";
import { findInventoryItem } from "@/server/actions/inventory";

export default function ScanPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [imeiInput, setImeiInput] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    type: string;
    value: string;
    valid: boolean;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scannerRef = useRef<any>(null);
  const [scanMethod, setScanMethod] = useState<"manual" | "camera">("manual");

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
      }
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const value = imeiInput.trim();
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length === 15) {
      const valid = validateIMEI(cleaned);
      setResult({ type: "IMEI", value: cleaned, valid });
      if (valid) {
        const item = await findInventoryItem(cleaned);
        if (item) {
          showToast("Inventory item found", "success");
          router.push(`/inventory/${item.id}`);
        } else {
          setError("No inventory item matches this IMEI.");
          showToast("IMEI not found", "error");
        }
      } else {
        showToast("Invalid IMEI checksum", "error");
      }
    } else if (cleaned.length > 0) {
      const item = await findInventoryItem(value);
      setResult({ type: "BARCODE", value, valid: Boolean(item) });
      if (item) {
        showToast("Inventory item found", "success");
        router.push(`/inventory/${item.id}`);
      } else {
        setError("No inventory item matches this code.");
        showToast("Item not found", "error");
      }
    } else {
      setError("Please enter or scan a value");
    }
  }

  async function startCamera() {
    setIsScanning(true);
    setScanMethod("camera");
    try {
      // Use html5-qrcode library
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("scanner-element");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText: string) => {
          // On successful scan
          const cleaned = decodedText.replace(/\D/g, "");
          if (cleaned.length === 15 && validateIMEI(cleaned)) {
            setImeiInput(cleaned);
            showToast("IMEI detected!", "success");
          } else {
            setImeiInput(decodedText);
          }
          scanner.stop().catch(() => {});
          setIsScanning(false);
          setScanMethod("manual");
        },
        () => {
          // QR scan failure (no code detected in frame) - keep scanning
        }
      );
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied. Please use manual entry.");
      setScanMethod("manual");
      setIsScanning(false);
    }
  }

  function stopCamera() {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
    }
    setIsScanning(false);
    setScanMethod("manual");
  }

  const quickActions = [
    { label: "Receive New Phone", href: "/inventory/receive", icon: Smartphone },
    { label: "Find in Inventory", href: "/inventory", icon: Search },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Scan" description="Scan IMEI, barcode, or QR code" />

      <div className="px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Camera Scanner */}
        {scanMethod === "camera" && (
          <Card>
            <CardContent className="p-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-3">
                <div id="scanner-element" className="w-full h-full" />
                <div className="absolute inset-0 border-2 border-emerald-500/50 rounded-lg m-8" />
                <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-white/70">
                  Point camera at IMEI barcode or QR code
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={stopCamera}
                  className="flex-1 h-12"
                >
                  <StopCircle className="h-5 w-5 mr-2" />
                  Stop Camera
                </Button>
                <Button
                  onClick={() => {
                    stopCamera();
                    setScanMethod("manual");
                  }}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  Enter Manually
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Entry */}
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="text-sm font-medium text-slate-700">
                IMEI / Serial / Barcode
              </label>
              <div className="flex gap-2">
                <Input
                  value={imeiInput}
                  onChange={(e) => {
                    setImeiInput(e.target.value);
                    setError("");
                    setResult(null);
                  }}
                  placeholder="Enter or scan IMEI number"
                  className="flex-1 h-12 text-base"
                  autoFocus
                  inputMode="numeric"
                />
                {!isScanning && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={startCamera}
                    className="h-12 px-4"
                    title="Scan with camera"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Live IMEI validation feedback */}
              {imeiInput.replace(/\D/g, "").length > 0 && (
                <p className={`text-xs ${
                  imeiInput.replace(/\D/g, "").length === 15
                    ? validateIMEI(imeiInput.replace(/\D/g, ""))
                      ? "text-emerald-600"
                      : "text-red-600"
                    : "text-amber-600"
                }`}>
                  {imeiInput.replace(/\D/g, "").length}/15 digits
                  {imeiInput.replace(/\D/g, "").length === 15 && (
                    validateIMEI(imeiInput.replace(/\D/g, ""))
                      ? " ✓ Valid IMEI"
                      : " ✗ Invalid checksum"
                  )}
                </p>
              )}

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <Button type="submit" className="w-full h-12 text-base press-feedback">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </form>

            {result && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                result.valid ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
              }`}>
                <p className="font-medium">{result.type}</p>
                <p className="font-mono text-xs mt-1">{result.value}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 mb-2">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 card-hover"
              >
                <action.icon className="h-6 w-6 text-emerald-600" />
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
