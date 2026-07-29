"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { validateIMEI } from "@/lib/imei";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Search, Smartphone, Camera } from "lucide-react";

export default function ScanPage() {
  const router = useRouter();
  const [imeiInput, setImeiInput] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    type: string;
    value: string;
    valid: boolean;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanMethod, setScanMethod] = useState<"manual" | "camera">("manual");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const cleaned = imeiInput.replace(/\D/g, "");

    if (cleaned.length === 15) {
      const valid = validateIMEI(cleaned);
      setResult({ type: "IMEI", value: cleaned, valid });
      if (valid) {
        // Navigate to search results or product detail
        router.push(`/inventory?imei=${cleaned}`);
      }
    } else if (cleaned.length > 0) {
      setResult({ type: "BARCODE/SERIAL", value: cleaned, valid: true });
      router.push(`/inventory?q=${cleaned}`);
    } else {
      setError("Please enter or scan a value");
    }
  }

  async function startCamera() {
    setIsScanning(true);
    setScanMethod("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setError("Camera access denied. Please use manual entry.");
      setScanMethod("manual");
      setIsScanning(false);
    }
  }

  function stopCamera() {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
    }
    setIsScanning(false);
    setScanMethod("manual");
  }

  // Quick actions for common scans
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
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 border-2 border-blue-500/50 rounded-lg m-8" />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={stopCamera}
                  className="flex-1"
                >
                  Stop Camera
                </Button>
                <Button
                  onClick={() => {
                    stopCamera();
                    setScanMethod("manual");
                  }}
                  className="flex-1"
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
              <label className="text-sm font-medium text-gray-700">
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

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <Button type="submit" className="w-full h-12 text-base">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </form>

            {result && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                result.valid ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}>
                <p className="font-medium">{result.type}</p>
                <p className="font-mono text-xs mt-1">{result.value}</p>
                {result.type === "IMEI" && (
                  <p className="mt-1">
                    {result.valid ? "✓ Valid IMEI" : "✗ Invalid IMEI (Luhn check failed)"}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100"
              >
                <action.icon className="h-6 w-6 text-blue-600" />
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
