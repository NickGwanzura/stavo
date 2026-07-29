"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Customers"
        description="Manage your customer relationships"
        actions={<Button className="h-10"><Plus className="h-4 w-4 mr-2" />Add Customer</Button>}
      />
      <div className="px-4 sm:px-6 lg:px-8 text-center py-16">
        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-base font-semibold text-gray-900 mb-1">Customer module coming soon</h3>
        <p className="text-sm text-gray-500">Customer profiles, purchase history, and trade-in tracking.</p>
      </div>
    </div>
  );
}
