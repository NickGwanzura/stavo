"use server";

import { prisma } from "@/lib/db";
import { validateIMEI } from "@/lib/imei";
import { generateStockNumber } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ──────────────────────────────────────────────────────────────
// Schemas
// ──────────────────────────────────────────────────────────────

const receiveCellphoneSchema = z.object({
  organisationId: z.string(),
  branchId: z.string(),
  acquisitionType: z.enum([
    "PURCHASED_FROM_SUPPLIER",
    "BOUGHT_FROM_INDIVIDUAL",
    "CUSTOMER_TRADE_IN",
    "IMPORTED_STOCK",
    "BRANCH_TRANSFER",
    "OWNER_SUPPLIED",
    "OPENING_STOCK",
  ]),
  sourceName: z.string().optional(),
  sourceId: z.string().optional(),
  brandId: z.string().optional(),
  modelId: z.string().optional(),
  productName: z.string().optional(),
  colour: z.string().optional(),
  storageCapacity: z.string().optional(),
  ram: z.string().optional(),
  simConfig: z.string().optional(),
  networkStatus: z.string().optional(),
  condition: z.string().optional(),
  grade: z.string().optional(),
  boxIncluded: z.boolean().optional(),
  chargerIncluded: z.boolean().optional(),
  warrantyPeriod: z.number().optional(),
  purchaseDate: z.string().optional(),
  notes: z.string().optional(),
  // IMEI
  imei1: z.string().optional(),
  imei2: z.string().optional(),
  serialNumber: z.string().optional(),
  // Costs
  purchasePrice: z.number().optional(),
  shippingCost: z.number().optional(),
  customsCost: z.number().optional(),
  repairCost: z.number().optional(),
  transportCost: z.number().optional(),
  commissionCost: z.number().optional(),
  otherCost: z.number().optional(),
  currency: z.string().default("USD"),
  // Pricing
  cashPrice: z.number().optional(),
  wholesalePrice: z.number().optional(),
  instalmentPrice: z.number().optional(),
  minimumPrice: z.number().optional(),
});

const receiveAccessorySchema = z.object({
  organisationId: z.string(),
  branchId: z.string(),
  brandId: z.string().optional(),
  modelId: z.string().optional(),
  sku: z.string().optional(),
  productName: z.string(),
  description: z.string().optional(),
  quantity: z.number().min(1).default(1),
  unitCost: z.number().optional(),
  sellingPrice: z.number().optional(),
});

// ──────────────────────────────────────────────────────────────
// Server Actions
// ──────────────────────────────────────────────────────────────

export async function receiveCellphone(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const data = receiveCellphoneSchema.parse(raw);

    // Validate IMEI if provided
    if (data.imei1 && !validateIMEI(data.imei1)) {
      return { success: false as const, error: "IMEI 1 is invalid (Luhn check failed)" };
    }
    if (data.imei2 && !validateIMEI(data.imei2)) {
      return { success: false as const, error: "IMEI 2 is invalid (Luhn check failed)" };
    }

    // Check duplicate IMEIs within organisation
    if (data.imei1) {
      const existing = await prisma.productIdentifier.findFirst({
        where: {
          organisationId: data.organisationId,
          value: data.imei1,
          isActive: true,
        },
      });
      if (existing) {
        return { success: false as const, error: `IMEI ${data.imei1} already exists in inventory` };
      }
    }

    // Generate stock number
    const stockNumber = generateStockNumber("PHN");

    // Create inventory item in a transaction
    const item = await prisma.$transaction(async (tx) => {
      // Create the inventory item
      const inventoryItem = await tx.inventoryItem.create({
        data: {
          organisationId: data.organisationId,
          branchId: data.branchId,
          stockNumber,
          productName: data.productName || `Phone ${data.imei1?.slice(-4) || stockNumber.slice(-6)}`,
          brandId: data.brandId,
          modelId: data.modelId,
          colour: data.colour,
          storageCapacity: data.storageCapacity,
          ram: data.ram,
          simConfig: data.simConfig,
          networkStatus: data.networkStatus,
          condition: data.condition,
          grade: data.grade,
          boxIncluded: data.boxIncluded || false,
          chargerIncluded: data.chargerIncluded || false,
          warrantyPeriod: data.warrantyPeriod || 0,
          status: "IN_STOCK",
          notes: data.notes,
          isAccessory: false,
        },
      });

      // Create identifiers
      const identifiers: { organisationId: string; itemId: string; type: string; value: string }[] = [];
      if (data.imei1) identifiers.push({ organisationId: data.organisationId, itemId: inventoryItem.id, type: "IMEI_1", value: data.imei1 });
      if (data.imei2) identifiers.push({ organisationId: data.organisationId, itemId: inventoryItem.id, type: "IMEI_2", value: data.imei2 });
      if (data.serialNumber) identifiers.push({ organisationId: data.organisationId, itemId: inventoryItem.id, type: "SERIAL", value: data.serialNumber });

      if (identifiers.length > 0) {
        await tx.productIdentifier.createMany({ data: identifiers });
      }

      // Create acquisition record
      const acquisition = await tx.acquisition.create({
        data: {
          organisationId: data.organisationId,
          branchId: data.branchId,
          itemId: inventoryItem.id,
          type: data.acquisitionType,
          sourceName: data.sourceName,
          sourceId: data.sourceId,
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : new Date(),
        },
      });

      // Create acquisition costs
      const costs: { acquisitionId: string; type: string; amount: number; currency: string }[] = [];
      if (data.purchasePrice) costs.push({ acquisitionId: acquisition.id, type: "PURCHASE_PRICE", amount: data.purchasePrice, currency: data.currency });
      if (data.shippingCost) costs.push({ acquisitionId: acquisition.id, type: "SHIPPING", amount: data.shippingCost, currency: data.currency });
      if (data.customsCost) costs.push({ acquisitionId: acquisition.id, type: "CUSTOMS", amount: data.customsCost, currency: data.currency });
      if (data.repairCost) costs.push({ acquisitionId: acquisition.id, type: "REPAIR", amount: data.repairCost, currency: data.currency });
      if (data.transportCost) costs.push({ acquisitionId: acquisition.id, type: "TRANSPORT", amount: data.transportCost, currency: data.currency });
      if (data.commissionCost) costs.push({ acquisitionId: acquisition.id, type: "COMMISSION", amount: data.commissionCost, currency: data.currency });
      if (data.otherCost) costs.push({ acquisitionId: acquisition.id, type: "OTHER", amount: data.otherCost, currency: data.currency });

      if (costs.length > 0) {
        await tx.acquisitionCost.createMany({ data: costs });
      }

      // Create prices
      const prices: { itemId: string; type: string; amount: number; currency: string }[] = [];
      if (data.cashPrice) prices.push({ itemId: inventoryItem.id, type: "CASH", amount: data.cashPrice, currency: data.currency });
      if (data.wholesalePrice) prices.push({ itemId: inventoryItem.id, type: "WHOLESALE", amount: data.wholesalePrice, currency: data.currency });
      if (data.instalmentPrice) prices.push({ itemId: inventoryItem.id, type: "INSTALMENT", amount: data.instalmentPrice, currency: data.currency });
      if (data.minimumPrice) prices.push({ itemId: inventoryItem.id, type: "MINIMUM", amount: data.minimumPrice, currency: data.currency });

      if (prices.length > 0) {
        await tx.productPrice.createMany({ data: prices });
      }

      return inventoryItem;
    });

    revalidatePath("/inventory");
    return { success: true as const, data: { id: item.id, stockNumber: item.stockNumber } };
  } catch (error) {
    console.error("Receive cellphone error:", error);
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.errors.map((e) => e.message).join(", ") };
    }
    return { success: false as const, error: "Failed to receive cellphone. Please try again." };
  }
}

export async function receiveAccessory(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const data = receiveAccessorySchema.parse(raw);

    // Check for existing SKU
    if (data.sku) {
      const existing = await prisma.accessoryStock.findFirst({
        where: { organisationId: data.organisationId, sku: data.sku },
      });
      if (existing) {
        // Add to existing quantity
        await prisma.accessoryStock.update({
          where: { id: existing.id },
          data: { quantity: { increment: data.quantity } },
        });
        revalidatePath("/inventory");
        return { success: true as const, data: { id: existing.id, type: "incremented" } };
      }
    }

    const stock = await prisma.accessoryStock.create({
      data: {
        organisationId: data.organisationId,
        branchId: data.branchId,
        brandId: data.brandId,
        modelId: data.modelId,
        sku: data.sku,
        productName: data.productName,
        description: data.description,
        quantity: data.quantity,
        unitCost: data.unitCost,
        sellingPrice: data.sellingPrice,
      },
    });

    revalidatePath("/inventory");
    return { success: true as const, data: { id: stock.id, type: "created" } };
  } catch (error) {
    console.error("Receive accessory error:", error);
    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.errors.map((e) => e.message).join(", ") };
    }
    return { success: false as const, error: "Failed to receive accessory." };
  }
}

export async function getInventoryItems(organisationId: string, branchId?: string) {
  const where: Record<string, unknown> = { isActive: true, isAccessory: false };
  if (branchId) where.branchId = branchId;

  const items = await prisma.inventoryItem.findMany({
    where,
    include: {
      brand: { select: { name: true } },
      model: { select: { name: true } },
      identifiers: { select: { type: true, value: true } },
      prices: { select: { type: true, amount: true, currency: true } },
      branch: { select: { name: true } },
      acquisition: {
        select: { purchaseDate: true, type: true, costs: { select: { type: true, amount: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return items;
}

export async function getInventoryItemById(id: string) {
  const item = await prisma.inventoryItem.findUnique({
    where: { id },
    include: {
      brand: { select: { name: true } },
      model: { select: { name: true } },
      identifiers: true,
      photos: true,
      documents: true,
      prices: true,
      branch: { select: { id: true, name: true } },
      location: { select: { id: true, name: true } },
      acquisition: { include: { costs: true, supplier: { select: { name: true } } } },
      deviceTests: { include: { issues: true }, orderBy: { testDate: "desc" } },
      repairJobs: { orderBy: { createdAt: "desc" } },
      stockMovements: { orderBy: { createdAt: "desc" }, take: 10 },
      warranty: { include: { claims: true } },
    },
  });

  return item;
}
