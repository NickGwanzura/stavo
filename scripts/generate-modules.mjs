import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(__dirname, "../src/app");

const modules = [
  { dir: "suppliers", comp: "Suppliers", title: "Suppliers", icon: "Truck", desc: "Manage supplier relationships and purchases" },
  { dir: "purchases", comp: "Purchases", title: "Purchase Orders", icon: "ShoppingBag", desc: "Track purchase orders and deliveries" },
  { dir: "transfers", comp: "Transfers", title: "Stock Transfers", icon: "ArrowLeftRight", desc: "Transfer stock between branches" },
  { dir: "stock-counts", comp: "StockCounts", title: "Stock Counts", icon: "ClipboardList", desc: "Conduct and approve stock takes" },
  { dir: "reservations", comp: "Reservations", title: "Reservations", icon: "Clock", desc: "Manage customer reservations" },
  { dir: "instalments", comp: "Instalments", title: "Instalments", icon: "Wallet", desc: "Track instalment payment schedules" },
  { dir: "cash-up", comp: "CashUp", title: "Daily Cash-Up", icon: "DollarSign", desc: "Daily cash reconciliation" },
  { dir: "warranty", comp: "Warranty", title: "Warranty", icon: "Shield", desc: "Manage warranty claims and repairs" },
  { dir: "trade-in", comp: "TradeIn", title: "Trade-In", icon: "ArrowLeftRight", desc: "Assess and process trade-ins" },
  { dir: "reports", comp: "Reports", title: "Reports", icon: "BarChart3", desc: "View business reports and analytics" },
  { dir: "users", comp: "Users", title: "Users", icon: "UserCircle", desc: "Manage users and permissions" },
  { dir: "settings", comp: "Settings", title: "Settings", icon: "Settings", desc: "Configure business settings" },
];

for (const m of modules) {
  const pageContent = `import { prisma } from "@/lib/db";
import { ${m.comp}Client } from "./${m.dir}-client";

export const dynamic = "force-dynamic";

export default async function ${m.comp}Page() {
  try {
    const modelName = "${m.dir}" === "cash-up" ? "cashUp" : "${m.dir}".replace(/-/g, "_");
    const items = await (prisma as any)[modelName].findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return <${m.comp}Client items={items} />;
  } catch {
    return <${m.comp}Client items={[]} />;
  }
}
`;

  const clientContent = `"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, ${m.icon} } from "lucide-react";

interface ItemData {
  id: string;
  name?: string;
  description?: string;
  createdAt?: Date;
}

export function ${m.comp}Client({ items: _items }: { items: ItemData[] }) {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-4">
      <PageHeader
        title="${m.title}"
        description="${m.desc}"
        actions={
          <Button className="h-10 press-feedback">
            <Plus className="h-4 w-4 mr-2" />
            New ${m.title.replace(/s$/, "").replace(/s$/, "")}
          </Button>
        }
      />
      <div className="px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ${m.title.toLowerCase()}..."
            className="pl-9 h-11 press-feedback"
          />
        </div>
        {_items.length === 0 ? (
          <div className="text-center py-16">
            <${m.icon} className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-900 mb-1">No ${m.title.toLowerCase()} yet</h3>
            <p className="text-sm text-slate-500">Create your first ${m.title.toLowerCase().replace(/s$/, "").replace(/s$/, "")} to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {_items.map((item) => (
              <Card key={item.id} className="card-hover">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.name || item.description || item.id}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
`;

  const dirPath = path.join(appDir, m.dir);
  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(path.join(dirPath, "page.tsx"), pageContent);
  fs.writeFileSync(path.join(dirPath, `${m.dir}-client.tsx`), clientContent);
  console.log(`Generated ${m.dir}`);
}

console.log("\nAll 12 modules generated successfully!");
