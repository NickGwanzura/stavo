"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
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
  BarChart3,
  DollarSign,
  ShoppingBag,
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
  { href: "/reports", label: "Reports", icon: BarChart3 },
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
  { href: "/reservations", label: "Reservations", icon: ClockIcon },
  { href: "/reports", label: "Reports", icon: BarChart3 },
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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [sidebarOpen]);

  const isNavActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`));

  async function handleSignOut() {
    await authClient.signOut();
    router.replace("/auth/login");
    router.refresh();
  }

  // Don't show the app shell on auth pages
  if (pathname?.startsWith("/auth")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col gap-y-5 border-r border-slate-200 bg-white px-4 pb-4 pt-4 h-full">
          <div className="flex items-center gap-x-3 px-2">
            <Image src="/logo.jpg" alt="TSM Mobiles" width={44} height={44} className="h-11 w-11 rounded-lg bg-slate-50 p-1 object-contain" priority />
            <span className="text-lg font-semibold text-slate-900">
              TSM Mobiles
            </span>
          </div>
          <nav className="flex flex-1 flex-col overflow-y-auto">
            <ul className="flex flex-1 flex-col gap-y-1">
              {sidebarNavItems.map((item) => {
                const isActive = isNavActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
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
          <div className="border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        aria-hidden={!sidebarOpen}
        inert={!sidebarOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white shadow-xl transform transition-transform duration-200 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <span className="text-lg font-semibold text-slate-900">Menu</span>
          <button
            type="button"
            aria-label="Close navigation menu"
            title="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {moreMenuItems.map((item) => {
            const isActive = isNavActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex min-h-11 items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-100"
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
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white lg:hidden">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              type="button"
              aria-label="Open navigation menu"
              title="Open navigation menu"
              onClick={() => setSidebarOpen(true)}
              aria-expanded={sidebarOpen}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-base font-semibold text-slate-900">
              TSM Mobiles
            </span>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page Content */}
        <main id="main-content" tabIndex={-1} className="pb-safe outline-none lg:pb-8">{children}</main>

        {/* Bottom Navigation (Mobile) */}
        <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white pb-nav-safe lg:hidden" aria-label="Primary navigation">
          <div className="flex items-center justify-around h-16 px-2">
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href;
              if (item.prominent) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative -mt-4 flex h-14 w-14 items-center justify-center rounded-full transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                      isActive
                        ? "bg-emerald-800 ring-4 ring-emerald-200"
                        : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 min-w-11 flex-col items-center justify-center gap-y-0.5 px-2 py-1 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                    isActive
                      ? "text-emerald-600"
                      : "text-slate-500 hover:text-slate-700"
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
