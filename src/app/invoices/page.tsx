import { prisma } from "@/lib/db";
import { getCurrentTenant } from "@/lib/tenant";
import { InvoicesPageClient } from "./invoices-page-client";


export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  try {
    const tenant = await getCurrentTenant();
    const invoices = await prisma.invoice.findMany({
      where: { organisationId: tenant.organisationId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        customer: { select: { name: true } },
      },
    });

    return (
      <InvoicesPageClient
        invoices={invoices.map((inv) => ({
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          customerName: inv.customer?.name || "Walk-in",
          date: inv.createdAt,
          total: inv.total.toNumber(),
          status: inv.status,
          amountPaid: inv.amountPaid?.toNumber() || 0,
          balanceDue: inv.balanceDue?.toNumber() || 0,
          currency: inv.currency,
        }))}
      />
    );
  } catch {
    return <InvoicesPageClient invoices={[]} />;
  }
}
