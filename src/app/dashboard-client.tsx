"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  Smartphone,
  Watch,
  Wrench,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  ScanLine,
  Repeat2,
  Truck,
} from "lucide-react";

interface DashboardData {
  totalStock: number;
  inStock: number;
  reserved: number;
  inRepair: number;
  soldToday: number;
  totalAccessories: number;
  todaySalesTotal: number;
  todayExpenses: number;
  stockValue: number;
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const netCashMovement = data.todaySalesTotal - data.todayExpenses;

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-7 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Today&apos;s overview of your business
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <DashboardCard
          title="Sales Today"
          value={formatCurrency(data.todaySalesTotal)}
          icon={TrendingUp}
          variant="success"
        />
        <DashboardCard
          title="Expenses"
          value={formatCurrency(data.todayExpenses)}
          icon={DollarSign}
          variant="destructive"
        />
        <DashboardCard
          title="Net Cash"
          value={formatCurrency(netCashMovement)}
          icon={ShoppingCart}
          variant={netCashMovement >= 0 ? "success" : "destructive"}
        />
        <DashboardCard
          title="Stock Value"
          value={formatCurrency(data.stockValue)}
          icon={Package}
          variant="default"
        />
      </div>

      {/* Stock Stats */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          Inventory Overview
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Total Items"
            value={data.totalStock}
            icon={Package}
            color="blue"
          />
          <StatCard
            label="In Stock"
            value={data.inStock}
            icon={Smartphone}
            color="green"
          />
          <StatCard
            label="Reserved"
            value={data.reserved}
            icon={Watch}
            color="amber"
          />
          <StatCard
            label="In Repair"
            value={data.inRepair}
            icon={Wrench}
            color="purple"
          />
          <StatCard
            label="Sold Today"
            value={data.soldToday}
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            label="Accessories"
            value={data.totalAccessories}
            icon={Package}
            color="gray"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <QuickActionButton
            label="Receive Stock"
            description="Add new items"
            href="/inventory/receive"
            icon={Truck}
            color="blue"
          />
          <QuickActionButton
            label="New Sale"
            description="Open point of sale"
            href="/pos"
            icon={ShoppingCart}
            color="green"
          />
          <QuickActionButton
            label="Scan IMEI"
            description="Find or add a device"
            href="/scan"
            icon={ScanLine}
            color="purple"
          />
          <QuickActionButton
            label="Trade-In"
            description="Assess a customer device"
            href="/trade-in"
            icon={Repeat2}
            color="amber"
          />
        </div>
      </div>

      {/* Low Stock Warning (placeholder) */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              No low stock alerts
            </p>
            <p className="text-xs text-amber-700 mt-1">
              All accessories are currently above minimum stock levels.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon: Icon,
  variant,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "default" | "success" | "destructive";
}) {
  const borderColor = {
    default: "border-emerald-200",
    success: "border-green-200",
    destructive: "border-red-200",
  }[variant];

  const iconBg = {
    default: "bg-emerald-100 text-emerald-700",
    success: "bg-green-100 text-green-700",
    destructive: "bg-red-100 text-red-700",
  }[variant];

  return (
    <Card className={`${borderColor}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500">{title}</p>
            <p className="text-lg font-bold text-slate-900">{value}</p>
          </div>
          <div className={`rounded-lg p-2 ${iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-emerald-50 text-emerald-700 border-emerald-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    gray: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <Card className={colors[color] || colors.gray}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-lg p-2 bg-white/80">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({
  label,
  description,
  href,
  icon: Icon,
  color,
}: {
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-emerald-700 hover:bg-emerald-800 focus-visible:ring-emerald-700",
    green: "bg-green-700 hover:bg-green-800 focus-visible:ring-green-700",
    purple: "bg-violet-700 hover:bg-violet-800 focus-visible:ring-violet-700",
    amber: "bg-amber-800 hover:bg-amber-900 focus-visible:ring-amber-800",
  };

  return (
    <Link
      href={href}
      aria-label={`${label}: ${description}`}
      className={`group flex min-h-16 items-center gap-3 rounded-xl px-4 py-3 text-left text-white shadow-sm transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99] ${colors[color]}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-0.5 block text-xs text-white/80">{description}</span>
      </span>
      <ArrowRight
        className="h-4 w-4 shrink-0 text-white/85 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
