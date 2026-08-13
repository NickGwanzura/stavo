import { prisma } from "@/lib/db";
import { CustomersClient } from "./customers-client";
import { getCurrentTenant } from "@/lib/tenant";


export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const tenant = await getCurrentTenant();
  const customers = await prisma.customer.findMany({
      where: { organisationId: tenant.organisationId, isActive: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

  return <CustomersClient customers={customers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      whatsapp: c.whatsapp,
      email: c.email,
      customerType: c.customerType,
      creditLimit: c.creditLimit?.toNumber() || 0,
      outstandingBalance: c.outstandingBalance?.toNumber() || 0,
      createdAt: c.createdAt,
  }))} />;
}
