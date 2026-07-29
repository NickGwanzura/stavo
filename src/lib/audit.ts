import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

type PrismaInputJsonType = Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined;

interface AuditEntry {
  organisationId: string;
  branchId?: string;
  userId: string;
  action: string;
  entity: string;
  recordId: string;
  previousValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        organisationId: entry.organisationId,
        branchId: entry.branchId,
        userId: entry.userId,
        action: entry.action,
        entity: entry.entity,
        recordId: entry.recordId,
        previousValues: entry.previousValues as unknown as PrismaInputJsonType,
        newValues: entry.newValues as unknown as PrismaInputJsonType,
        reason: entry.reason,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  } catch (error) {
    // Audit logging should never break the main operation
    console.error("Failed to create audit log:", error);
  }
}

/**
 * Create an audit log entry for a stock item change.
 */
export async function auditStockChange(
  organisationId: string,
  userId: string,
  itemId: string,
  action: string,
  previousValues: Record<string, unknown> | null,
  newValues: Record<string, unknown> | null,
  reason?: string
): Promise<void> {
  await createAuditLog({
    organisationId,
    userId,
    action,
    entity: "InventoryItem",
    recordId: itemId,
    previousValues: previousValues ?? undefined,
    newValues: newValues ?? undefined,
    reason,
  });
}
