import { Badge } from "./badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<
  string,
  { variant: "success" | "warning" | "destructive" | "default" | "purple" | "gray"; label: string }
> = {
  IN_STOCK: { variant: "success", label: "In Stock" },
  RESERVED: { variant: "warning", label: "Reserved" },
  SOLD: { variant: "default", label: "Sold" },
  IN_REPAIR: { variant: "warning", label: "In Repair" },
  RETURNED: { variant: "gray", label: "Returned" },
  WRITTEN_OFF: { variant: "destructive", label: "Written Off" },
  USED_FOR_PARTS: { variant: "gray", label: "Used for Parts" },
  RETURNED_TO_SUPPLIER: { variant: "gray", label: "Returned to Supplier" },
  QUARANTINED: { variant: "destructive", label: "Quarantined" },
  DRAFT: { variant: "gray", label: "Draft" },
  SENT: { variant: "default", label: "Sent" },
  VIEWED: { variant: "default", label: "Viewed" },
  ACCEPTED: { variant: "success", label: "Accepted" },
  REJECTED: { variant: "destructive", label: "Rejected" },
  EXPIRED: { variant: "gray", label: "Expired" },
  CONVERTED: { variant: "success", label: "Converted" },
  CANCELLED: { variant: "destructive", label: "Cancelled" },
  ISSUED: { variant: "default", label: "Issued" },
  PARTIALLY_PAID: { variant: "warning", label: "Partially Paid" },
  PAID: { variant: "success", label: "Paid" },
  OVERDUE: { variant: "destructive", label: "Overdue" },
  REFUNDED: { variant: "gray", label: "Refunded" },
  PENDING: { variant: "warning", label: "Pending" },
  COMPLETED: { variant: "success", label: "Completed" },
  FAILED: { variant: "destructive", label: "Failed" },
  ACTIVE: { variant: "default", label: "Active" },
  DEPOSIT_FORFEITED: { variant: "destructive", label: "Deposit Forfeited" },
  IN_TRANSIT: { variant: "warning", label: "In Transit" },
  RECEIVED: { variant: "success", label: "Received" },
  DISCREPANCY: { variant: "destructive", label: "Discrepancy" },
  SUBMITTED: { variant: "default", label: "Submitted" },
  APPROVED: { variant: "success", label: "Approved" },
  IN_PROGRESS: { variant: "warning", label: "In Progress" },
  DEFAULTED: { variant: "destructive", label: "Defaulted" },
  REPAIRED: { variant: "success", label: "Repaired" },
  REPLACED: { variant: "purple", label: "Replaced" },
  STORE_CREDIT: { variant: "default", label: "Store Credit" },
  CLAIM_REJECTED: { variant: "destructive", label: "Claim Rejected" },
  SENT_TO_SUPPLIER: { variant: "gray", label: "Sent to Supplier" },
  ORDERED: { variant: "default", label: "Ordered" },
  PARTIALLY_RECEIVED: { variant: "warning", label: "Partially Received" },
  PENDING_APPROVAL: { variant: "warning", label: "Pending Approval" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) {
    return (
      <Badge variant="gray" className={className}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
