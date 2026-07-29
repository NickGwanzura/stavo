"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Search, Plus, Users, Phone, Mail, UserPlus } from "lucide-react";

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  customerType: string;
  creditLimit: number;
  outstandingBalance: number;
  createdAt: Date;
}

export function CustomersClient({ customers }: { customers: CustomerData[] }) {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  async function handleCreateCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const { createCustomer } = await import("@/server/actions/customers");
      const result = await createCustomer(fd);
      if (result.success) {
        showToast("Customer created successfully", "success");
        setShowForm(false);
        form.reset();
      } else {
        showToast(result.error || "Failed to create customer", "error");
      }
    } catch {
      showToast("Failed to create customer", "error");
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Customers"
        description={`${customers.length} customers`}
        actions={
          <Button className="h-10" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        }
      />

      <div className="px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="pl-9 h-11"
          />
        </div>

        {/* Add Customer Form */}
        {showForm && (
          <Card className="border-emerald-200">
            <CardContent className="p-4">
              <form onSubmit={handleCreateCustomer} className="space-y-3">
                <input type="hidden" name="organisationId" value="org-placeholder" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Name *</Label>
                    <Input name="name" required placeholder="Customer name" />
                  </div>
                  <div className="space-y-1">
                    <Label>Phone *</Label>
                    <Input name="phone" required placeholder="+263 77..." inputMode="tel" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>WhatsApp</Label>
                    <Input name="whatsapp" placeholder="WhatsApp number" />
                  </div>
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <Input name="email" type="email" placeholder="email@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Type</Label>
                    <select name="customerType" className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                      <option>Walk-in</option>
                      <option>Retail</option>
                      <option>Wholesale</option>
                      <option>Reseller</option>
                      <option>Corporate</option>
                      <option>VIP</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Credit Limit (USD)</Label>
                    <Input name="creditLimit" type="number" step="0.01" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Address</Label>
                  <Input name="address" placeholder="Address (optional)" />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button type="submit" className="flex-1">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Save Customer
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Customer List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-900 mb-1">No customers found</h3>
            <p className="text-sm text-slate-500">Add your first customer to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((customer) => (
              <Card key={customer.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-semibold text-slate-900">{customer.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </span>
                        {customer.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        {customer.customerType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">Since {formatDate(customer.createdAt)}</span>
                    {customer.outstandingBalance > 0 && (
                      <span className="text-red-600 font-medium">
                        Balance: {formatCurrency(customer.outstandingBalance)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
