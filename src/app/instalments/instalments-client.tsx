"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Wallet } from "lucide-react";

interface ItemData {
  id: string;
  name?: string;
  description?: string;
  createdAt?: Date;
}

export function InstalmentsClient({ items: _items }: { items: ItemData[] }) {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-4">
      <PageHeader
        title="Instalments"
        description="Track instalment payment schedules"
        actions={
          <Button className="h-10 press-feedback">
            <Plus className="h-4 w-4 mr-2" />
            New Instalment
          </Button>
        }
      />
      <div className="px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search instalments..."
            className="pl-9 h-11 press-feedback"
          />
        </div>
        {_items.length === 0 ? (
          <div className="text-center py-16">
            <Wallet className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-900 mb-1">No instalments yet</h3>
            <p className="text-sm text-slate-500">Create your first instalment to get started.</p>
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
