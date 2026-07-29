import { DashboardClient } from "./dashboard-client";
import { getCurrentTenant } from "@/lib/tenant";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const { prisma } = await import("@/lib/db");
    const tenant = await getCurrentTenant();
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));

    const [
      totalInventoryItems,
      inStockItems,
      reservedItems,
      inRepairItems,
      soldTodayCount,
      totalAccessoryStock,
    ] = await Promise.all([
      prisma.inventoryItem.count({ where: { organisationId: tenant.organisationId, isActive: true } }),
      prisma.inventoryItem.count({
        where: { organisationId: tenant.organisationId, isActive: true, status: "IN_STOCK" },
      }),
      prisma.inventoryItem.count({
        where: { organisationId: tenant.organisationId, isActive: true, status: "RESERVED" },
      }),
      prisma.inventoryItem.count({
        where: { organisationId: tenant.organisationId, isActive: true, status: "IN_REPAIR" },
      }),
      prisma.inventoryItem.count({
        where: {
          organisationId: tenant.organisationId,
          status: "SOLD",
          updatedAt: { gte: todayStart },
        },
      }),
      prisma.accessoryStock.aggregate({
        _sum: { quantity: true },
        where: { organisationId: tenant.organisationId, isActive: true },
      }),
    ]);

    const todaySales = await prisma.sale.aggregate({
      _sum: { total: true },
      where: {
        organisationId: tenant.organisationId,
        saleDate: { gte: todayStart },
        status: "COMPLETED",
      },
    });

    const todayExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        organisationId: tenant.organisationId,
        expenseDate: { gte: todayStart },
        status: "APPROVED",
      },
    });

    const stockValue = await prisma.productPrice.aggregate({
      _sum: { amount: true },
      where: {
        type: "CASH",
        isActive: true,
        item: { organisationId: tenant.organisationId, isActive: true, status: "IN_STOCK" },
      },
    });

    return {
      totalStock: totalInventoryItems,
      inStock: inStockItems,
      reserved: reservedItems,
      inRepair: inRepairItems,
      soldToday: soldTodayCount,
      totalAccessories: totalAccessoryStock._sum.quantity || 0,
      todaySalesTotal: todaySales._sum.total?.toNumber() || 0,
      todayExpenses: todayExpenses._sum.amount?.toNumber() || 0,
      stockValue: stockValue._sum.amount?.toNumber() || 0,
    };
  } catch (error) {
    console.error("Dashboard data fetch failed:", error);
    // Return empty data when database is not available
    return {
      totalStock: 0,
      inStock: 0,
      reserved: 0,
      inRepair: 0,
      soldToday: 0,
      totalAccessories: 0,
      todaySalesTotal: 0,
      todayExpenses: 0,
      stockValue: 0,
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return <DashboardClient data={data} />;
}
