"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import {
  FileText,
  Users,
  Truck,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Settings,
  Clock,
} from "lucide-react";

const menuItems = [
  { href: "/quotations", label: "Quotations", icon: FileText, color: "blue" },
  { href: "/invoices", label: "Invoices", icon: FileText, color: "green" },
  { href: "/customers", label: "Customers", icon: Users, color: "blue" },
  { href: "/suppliers", label: "Suppliers", icon: Truck, color: "purple" },
  { href: "/expenses", label: "Expenses", icon: DollarSign, color: "red" },
  { href: "/purchases", label: "Purchases", icon: ShoppingBag, color: "blue" },
  { href: "/reservations", label: "Reservations", icon: Clock, color: "amber" },
  { href: "/reports", label: "Reports", icon: BarChart3, color: "blue" },
  { href: "/settings", label: "Settings", icon: Settings, color: "gray" },
];

const colorMap: Record<string, string> = {
  blue: "bg-emerald-50 text-emerald-700",
  green: "bg-green-50 text-green-700",
  purple: "bg-purple-50 text-purple-700",
  red: "bg-red-50 text-red-700",
  amber: "bg-amber-50 text-amber-700",
  gray: "bg-slate-50 text-slate-700",
};

export default function MorePage() {
  return (
    <div className="space-y-4">
      <PageHeader title="More" description="All modules and settings" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <div className={`rounded-lg p-2.5 ${colorMap[item.color]}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
