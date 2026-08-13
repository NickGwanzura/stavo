"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { formatDocumentNumber, getPaymentAccountType, paymentMethods } from "@/lib/sales";
import { getCurrentTenant } from "@/lib/tenant";

const saleSchema = z.object({
  items: z.array(z.object({ id: z.string().cuid(), qty: z.literal(1) })).min(1).max(50),
  paymentMethod: z.enum(paymentMethods.map((method) => method.code) as [string, ...string[]]),
});

export async function getSellableInventory() {
  const tenant = await getCurrentTenant();
  const items = await prisma.inventoryItem.findMany({
    where: {
      organisationId: tenant.organisationId,
      branchId: tenant.branchId,
      status: "IN_STOCK",
      isActive: true,
      isAccessory: false,
    },
    include: {
      identifiers: { where: { isActive: true }, select: { value: true } },
      prices: { where: { type: "CASH", isActive: true }, take: 1 },
    },
    take: 100,
    orderBy: { createdAt: "desc" },
  });
  return items.map((item) => ({
    id: item.id,
    name: item.productName || item.stockNumber,
    search: `${item.productName || ""} ${item.stockNumber} ${item.identifiers.map((id) => id.value).join(" ")}`.trim(),
    price: item.prices[0]?.amount.toNumber() || 0,
  }));
}

export async function completeSale(input: unknown) {
  try {
    const data = saleSchema.parse(input);
    const tenant = await getCurrentTenant();
    const uniqueIds = new Set(data.items.map((item) => item.id));
    if (uniqueIds.size !== data.items.length) {
      return { success: false as const, error: "The same phone cannot be added twice." };
    }
    const accountType = getPaymentAccountType(data.paymentMethod as never);

    const invoice = await prisma.$transaction(async (tx) => {
      const stock = await tx.inventoryItem.findMany({
        where: {
          id: { in: [...uniqueIds] },
          organisationId: tenant.organisationId,
          branchId: tenant.branchId,
          status: "IN_STOCK",
          isActive: true,
          isAccessory: false,
        },
        include: {
          prices: { where: { type: "CASH", isActive: true }, take: 1 },
          identifiers: { where: { isActive: true, type: "IMEI_1" }, take: 1 },
          acquisition: { include: { costs: true } },
        },
      });
      if (stock.length !== data.items.length || stock.some((item) => !item.prices[0])) {
        throw new Error("STOCK_CHANGED");
      }

      const account = await tx.financialAccount.findFirst({
        where: { organisationId: tenant.organisationId, type: accountType, isActive: true },
        select: { id: true },
      });
      if (!account) throw new Error("PAYMENT_ACCOUNT_MISSING");

      const organisation = await tx.organisation.update({
        where: { id: tenant.organisationId },
        data: { nextInvoiceNumber: { increment: 1 } },
        select: {
          invoicePrefix: true,
          defaultCurrency: true,
          defaultPaymentTerms: true,
          warrantyTerms: true,
          nextInvoiceNumber: true,
        },
      });

      const lines = stock.map((item) => {
        const price = item.prices[0]!.amount;
        const cost = item.acquisition?.costs.reduce((sum, entry) => sum.add(entry.amount), new Prisma.Decimal(0)) || new Prisma.Decimal(0);
        return {
          itemId: item.id,
          description: item.productName || item.stockNumber,
          imei: item.identifiers[0]?.value,
          quantity: 1,
          unitPrice: price,
          cost,
          total: price,
        };
      });
      const total = lines.reduce((sum, line) => sum.add(line.total), new Prisma.Decimal(0));
      const totalCost = lines.reduce((sum, line) => sum.add(line.cost), new Prisma.Decimal(0));
      const invoiceNumber = formatDocumentNumber(organisation.invoicePrefix, organisation.nextInvoiceNumber - 1);

      for (const item of stock) {
        const updated = await tx.inventoryItem.updateMany({
          where: { id: item.id, organisationId: tenant.organisationId, branchId: tenant.branchId, status: "IN_STOCK" },
          data: { status: "SOLD" },
        });
        if (updated.count !== 1) throw new Error("STOCK_CHANGED");
      }

      const createdInvoice = await tx.invoice.create({
        data: {
          organisationId: tenant.organisationId,
          branchId: tenant.branchId,
          createdById: tenant.userId,
          invoiceNumber,
          subtotal: total,
          total,
          amountPaid: total,
          balanceDue: 0,
          currency: organisation.defaultCurrency,
          status: "PAID",
          paymentTerms: organisation.defaultPaymentTerms,
          warrantyTerms: organisation.warrantyTerms,
          items: { create: lines.map((line) => ({ itemId: line.itemId, description: line.description, imei: line.imei, quantity: line.quantity, unitPrice: line.unitPrice, total: line.total })) },
        },
      });
      await tx.sale.create({
        data: {
          organisationId: tenant.organisationId,
          branchId: tenant.branchId,
          invoiceId: createdInvoice.id,
          total,
          costOfGoodsSold: totalCost,
          grossProfit: total.sub(totalCost),
          currency: organisation.defaultCurrency,
          items: { create: lines.map((line) => ({ ...line, saleId: undefined })) },
        },
      });
      const payment = await tx.payment.create({
        data: {
          organisationId: tenant.organisationId,
          invoiceId: createdInvoice.id,
          financialAccountId: account.id,
          amount: total,
          currency: organisation.defaultCurrency,
          paymentMethod: data.paymentMethod,
          paidById: tenant.userId,
          allocations: {
            create: {
              type: "INVOICE",
              referenceId: createdInvoice.id,
              amount: total,
              allocatedById: tenant.userId,
            },
          },
        },
      });
      await tx.financialAccount.update({ where: { id: account.id }, data: { balance: { increment: total } } });
      await tx.auditLog.create({
        data: {
          organisationId: tenant.organisationId,
          branchId: tenant.branchId,
          userId: tenant.userId,
          action: "CREATE",
          entity: "Sale",
          recordId: createdInvoice.id,
          newValues: { invoiceNumber, total: total.toString(), paymentId: payment.id, paymentMethod: data.paymentMethod },
        },
      });
      return createdInvoice;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    revalidatePath("/invoices");
    revalidatePath("/");
    return { success: true as const, invoiceId: invoice.id };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false as const, error: "Choose valid in-stock items and a payment method." };
    if (error instanceof Error && error.message === "STOCK_CHANGED") return { success: false as const, error: "Stock changed while completing the sale. Refresh and try again." };
    if (error instanceof Error && error.message === "PAYMENT_ACCOUNT_MISSING") return { success: false as const, error: "The selected payment account is not configured." };
    return { success: false as const, error: "Unable to complete sale." };
  }
}

export async function createQuotation(input: unknown) {
  try {
    const data = z.object({ description: z.string().trim().min(1), price: z.coerce.number().positive() }).parse(input);
    const tenant = await getCurrentTenant();
    await prisma.$transaction(async (tx) => {
      const organisation = await tx.organisation.update({
        where: { id: tenant.organisationId },
        data: { nextQuotationNumber: { increment: 1 } },
        select: { quotationPrefix: true, nextQuotationNumber: true, defaultCurrency: true, defaultPaymentTerms: true, warrantyTerms: true },
      });
      const quotation = await tx.quotation.create({
        data: {
          organisationId: tenant.organisationId,
          branchId: tenant.branchId,
          createdById: tenant.userId,
          quotationNumber: formatDocumentNumber(organisation.quotationPrefix, organisation.nextQuotationNumber - 1),
          subtotal: data.price,
          total: data.price,
          currency: organisation.defaultCurrency,
          paymentTerms: organisation.defaultPaymentTerms,
          warrantyTerms: organisation.warrantyTerms,
          items: { create: { description: data.description, quantity: 1, unitPrice: data.price, total: data.price } },
        },
      });
      await tx.auditLog.create({ data: { organisationId: tenant.organisationId, branchId: tenant.branchId, userId: tenant.userId, action: "CREATE", entity: "Quotation", recordId: quotation.id, newValues: { total: String(data.price) } } });
    });
    revalidatePath("/quotations");
    return { success: true as const };
  } catch {
    return { success: false as const, error: "Unable to create quotation." };
  }
}
