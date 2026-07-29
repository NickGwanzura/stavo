"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Package,
  ScanLine,
  ShoppingCart,
  MoreHorizontal,
  X,
  Menu,
  LogOut,
  Settings,
  FileText,
  Users,
  Truck,
  ClipboardList,
  BarChart3,
  DollarSign,
  ShoppingBag,
  ArrowLeftRight,
  UserCircle,
} from "lucide-react";
const bottomNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/scan", label: "Scan", icon: ScanLine, prominent: true },
  { href: "/pos", label: "Sell", icon: ShoppingCart },
  { href: "/more", label: "More", icon: MoreHorizontal },
];

const moreMenuItems = [
  { href: "/quotations", label: "Quotations", icon: FileText },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/suppliers", label: "Suppliers", icon: Truck },
  { href: "/expenses", label: "Expenses", icon: DollarSign },
  { href: "/purchases", label: "Purchases", icon: ShoppingBag },
  { href: "/transfers", label: "Transfers", icon: ArrowLeftRight },
  { href: "/stock-counts", label: "Stock Counts", icon: ClipboardList },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/users", label: "Users", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

const sidebarNavItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/pos", label: "Point of Sale", icon: ShoppingCart },
  { href: "/quotations", label: "Quotations", icon: FileText },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/suppliers", label: "Suppliers", icon: Truck },
  { href: "/expenses", label: "Expenses", icon: DollarSign },
  { href: "/purchases", label: "Purchases", icon: ShoppingBag },
  { href: "/transfers", label: "Transfers", icon: ArrowLeftRight },
  { href: "/stock-counts", label: "Stock Counts", icon: ClipboardList },
  { href: "/reservations", label: "Reservations", icon: ClockIcon },
  { href: "/instalments", label: "Instalments", icon: DollarSign },
  { href: "/cash-up", label: "Daily Cash-Up", icon: DollarSign },
  { href: "/warranty", label: "Warranty", icon: FileText },
  { href: "/trade-in", label: "Trade-In", icon: ArrowLeftRight },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/users", label: "Users", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show the app shell on auth pages
  if (pathname?.startsWith("/auth")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col gap-y-5 border-r border-gray-200 bg-white px-4 pb-4 pt-4 h-full">
          <div className="flex items-center gap-x-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-lg font-bold text-white">CD</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              CellDealer
            </span>
          </div>
          <nav className="flex flex-1 flex-col overflow-y-auto">
            <ul className="flex flex-1 flex-col gap-y-1">
              {sidebarNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t border-gray-200 pt-4">
            <button className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transform transition-transform duration-200 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {moreMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar (Mobile) */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white lg:hidden">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-base font-semibold text-gray-900">
              CellDealer
            </span>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page Content */}
        <main className="pb-20 lg:pb-8">{children}</main>

        {/* Bottom Navigation (Mobile) */}
        <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white lg:hidden">
          <div className="flex items-center justify-around h-16 px-2">
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href;
              if (item.prominent) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative -mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700 active:bg-blue-800"
                  >
                    <item.icon className="h-6 w-6" />
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-y-0.5 px-3 py-1 text-[10px] font-medium transition-colors",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
