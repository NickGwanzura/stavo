import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductDetailsClient } from "./product-details-client";
import { getCurrentTenant } from "@/lib/tenant";


export const dynamic = "force-dynamic";

async function getProduct(id: string) {
  try {
    const tenant = await getCurrentTenant();
    const item = await prisma.inventoryItem.findFirst({
      where: { id, organisationId: tenant.organisationId },
      include: {
        brand: { select: { name: true } },
        model: { select: { name: true } },
        identifiers: true,
        photos: { take: 5 },
        prices: true,
        branch: { select: { id: true, name: true } },
        location: { select: { id: true, name: true } },
        acquisition: {
          include: {
            costs: true,
            supplier: { select: { name: true } },
          },
        },
        deviceTests: {
          include: { issues: true },
          orderBy: { testDate: "desc" },
          take: 5,
        },
        repairJobs: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        stockMovements: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        warranty: {
          include: { claims: true },
        },
        reservation: true,
      },
    });

    if (!item) return null;

    return {
      id: item.id,
      stockNumber: item.stockNumber,
      productName: item.productName || "Unknown Product",
      brand: item.brand?.name || null,
      model: item.model?.name || null,
      colour: item.colour,
      storageCapacity: item.storageCapacity,
      ram: item.ram,
      simConfig: item.simConfig,
      networkStatus: item.networkStatus,
      condition: item.condition,
      grade: item.grade,
      status: item.status,
      branch: item.branch?.name || null,
      location: item.location?.name || null,
      shelfLocation: item.shelfLocation,
      boxIncluded: item.boxIncluded,
      chargerIncluded: item.chargerIncluded,
      warrantyPeriod: item.warrantyPeriod,
      notes: item.notes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      // Identifiers
      identifiers: item.identifiers.map((i) => ({
        type: i.type,
        value: i.value,
      })),
      // Prices
      prices: item.prices.map((p) => ({
        type: p.type,
        amount: p.amount.toNumber(),
        currency: p.currency,
      })),
      // Acquisition
      acquisition: item.acquisition
        ? {
            type: item.acquisition.type,
            sourceName: item.acquisition.sourceName,
            supplierName: item.acquisition.supplier?.name || null,
            purchaseDate: item.acquisition.purchaseDate,
            costs: item.acquisition.costs.map((c) => ({
              type: c.type,
              amount: c.amount.toNumber(),
              currency: c.currency,
            })),
          }
        : null,
      // Tests
      tests: item.deviceTests.map((t) => ({
        id: t.id,
        outcome: t.outcome,
        technicianNotes: t.technicianNotes,
        finalGrade: t.finalGrade,
        testDate: t.testDate,
        issues: t.issues.map((i) => ({
          category: i.category,
          issue: i.issue,
          severity: i.severity,
        })),
      })),
      // Repairs
      repairs: item.repairJobs.map((r) => ({
        id: r.id,
        reportedFault: r.reportedFault,
        status: r.status,
        totalCost: r.totalCost?.toNumber() || 0,
        createdAt: r.createdAt,
      })),
      // Movements
      movements: item.stockMovements.map((m) => ({
        type: m.type,
        fromLocation: m.fromLocation,
        toLocation: m.toLocation,
        createdAt: m.createdAt,
      })),
      // Warranty
      warranty: item.warranty
        ? {
            startDate: item.warranty.startDate,
            expiryDate: item.warranty.expiryDate,
            terms: item.warranty.terms,
          }
        : null,
      // Reservation
      reservation: item.reservation
        ? { status: item.reservation.status, expiryDate: item.reservation.expiryDate }
        : null,
    };
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
