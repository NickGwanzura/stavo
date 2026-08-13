"use client";

export function PrintButton() {
  return <button type="button" onClick={() => window.print()} className="min-h-11 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">Print / Save PDF</button>;
}
