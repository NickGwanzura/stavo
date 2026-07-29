/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default function QuotationsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Quotations"
        description="Create and manage customer quotations"
        actions={<Button className="h-10"><Plus className="h-4 w-4 mr-2" />New Quotation</Button>}
      />
      <div className="px-4 sm:px-6 lg:px-8 text-center py-16">
        <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-base font-semibold text-slate-900 mb-1">No quotations yet</h3>
        <p className="text-sm text-slate-500 mb-4">Create a quotation from the inventory product page.</p>
        <Button>Create Quotation</Button>
      </div>
    </div>
  );
}
