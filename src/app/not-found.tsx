import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Image src="/logo.jpg" alt="TSM Mobiles" width={96} height={96} className="mx-auto mb-6 h-24 w-24 rounded-2xl object-cover" />
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        This page doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/inventory"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          View Inventory
        </Link>
      </div>
    </div>
  );
}
