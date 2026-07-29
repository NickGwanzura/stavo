import { prisma } from "@/lib/db";
import { InventoryListClient } from "./inventory-list-client";

export const dynamic = "force-dynamic";

async function getInventoryData() {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { isActive: true, isAccessory: false },
      include: {
        brand: { select: { name: true } },
        model: { select: { name: true } },
        identifiers: { select: { type: true, value: true } },
        prices: { select: { type: true, amount: true, currency: true } },
        branch: { select: { name: true } },
        acquisition: {
          select: { purchaseDate: true, type: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const accessories = await prisma.accessoryStock.findMany({
      where: { isActive: true },
      include: {
        brand: { select: { name: true } },
        model: { select: { name: true } },
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return {
      items: items.map((item) => ({
        id: item.id,
        stockNumber: item.stockNumber,
        productName: item.productName || "Unknown",
        brand: item.brand?.name || null,
        model: item.model?.name || null,
        colour: item.colour,
        storage: item.storageCapacity,
        status: item.status,
        condition: item.condition,
        branch: item.branch?.name || null,
        cashPrice: item.prices?.find((p) => p.type === "CASH")?.amount?.toNumber() || null,
        cost: null,
        imei: item.identifiers?.find((i) => i.type === "IMEI_1")?.value || null,
        createdAt: item.createdAt,
      })),
      accessories: accessories.map((a) => ({
        id: a.id,
        sku: a.sku,
        productName: a.productName,
        brand: a.brand?.name || null,
        model: a.model?.name || null,
        quantity: a.quantity,
        unitCost: a.unitCost?.toNumber() || null,
        sellingPrice: a.sellingPrice?.toNumber() || null,
        branch: a.branch?.name || null,
      })),
    };
  } catch {
    return { items: [], accessories: [] };
  }
}

export default async function InventoryPage() {
  const data = await getInventoryData();

  return <InventoryListClient data={data} />;
}
