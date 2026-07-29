"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ArrowLeftRight, ClipboardList, DollarSign, Truck, ShoppingBag, Clock, Wallet, Shield, BarChart3, Settings as SettingsIcon, UserCircle, FileText } from "lucide-react";

const icons: Record<string, React.ComponentType<{className?: string}>> = {
  suppliers: Truck, purchases: ShoppingBag, transfers: ArrowLeftRight,
  "stock-counts": ClipboardList, expenses: DollarSign, reservations: Clock,
  instalments: Wallet, "cash-up": DollarSign, warranty: Shield,
  "trade-in": ArrowLeftRight, reports: BarChart3, settings: SettingsIcon,
  users: UserCircle, labels: FileText,
};

const titles: Record<string, string> = {
  suppliers: "Suppliers", purchases: "Purchases", transfers: "Stock Transfers",
  "stock-counts": "Stock Counts", expenses: "Expenses", reservations: "Reservations",
  instalments: "Instalments", "cash-up": "Daily Cash-Up", warranty: "Warranty",
  "trade-in": "Trade-In", reports: "Reports", settings: "Settings",
  users: "Users", labels: "Labels",
};

const descriptions: Record<string, string> = {
  suppliers: "Manage supplier relationships and purchases.",
  purchases: "Track purchase orders and supplier deliveries.",
  transfers: "Transfer stock between branches and locations.",
  "stock-counts": "Conduct and approve stock takes.",
  expenses: "Record and approve business expenses.",
  reservations: "Manage customer reservations and deposits.",
  instalments: "Track instalment payment schedules.",
  "cash-up": "Daily cash reconciliation and balancing.",
  warranty: "Manage warranty claims and repairs.",
  "trade-in": "Assess and process customer trade-ins.",
  reports: "View business reports and analytics.",
  settings: "Configure business settings and preferences.",
  users: "Manage users and permissions.",
  labels: "Print product labels and barcodes.",
};


export default function PlaceholderPage() {
  const dir = "settings";
  const Icon = icons[dir] || FileText;
  const title = titles[dir] || dir;
  const desc = descriptions[dir] || "Module coming soon.";

  return (
    <div className="space-y-4">
      <PageHeader title={title} description={desc} />
      <div className="px-4 sm:px-6 lg:px-8 text-center py-16">
        <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-base font-semibold text-gray-900 mb-1">Coming Soon</h3>
        <p className="text-sm text-gray-500">This module is under development.</p>
      </div>
    </div>
  );
}
