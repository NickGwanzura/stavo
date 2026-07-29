"use client";

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
    <div className="space-y-6 px-4 py-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
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
        <h2 className="mb-3 text-base font-semibold text-gray-900">
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
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickActionButton
            label="Receive Stock"
            href="/inventory/receive"
            color="blue"
          />
          <QuickActionButton
            label="New Sale"
            href="/pos"
            color="green"
          />
          <QuickActionButton
            label="Scan IMEI"
            href="/scan"
            color="purple"
          />
          <QuickActionButton
            label="Trade-In"
            href="/trade-in"
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
    default: "border-blue-200",
    success: "border-green-200",
    destructive: "border-red-200",
  }[variant];

  const iconBg = {
    default: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    destructive: "bg-red-100 text-red-700",
  }[variant];

  return (
    <Card className={`${borderColor}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">{title}</p>
            <p className="text-lg font-bold text-gray-900">{value}</p>
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
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <Card className={colors[color] || colors.gray}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-lg p-2 bg-white/80">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({
  label,
  href,
  color,
}: {
  label: string;
  href: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
    green: "bg-green-600 hover:bg-green-700 active:bg-green-800",
    purple: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
    amber: "bg-amber-600 hover:bg-amber-700 active:bg-amber-800",
  };

  return (
    <a
      href={href}
      className={`flex items-center justify-center rounded-xl px-4 py-4 text-sm font-medium text-white shadow-sm transition-colors ${colors[color]}`}
    >
      {label}
    </a>
  );
}
