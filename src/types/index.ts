// Common pagination params
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// Common filter params
export interface DateRangeFilter {
  from?: Date;
  to?: Date;
}

export interface BranchFilter {
  branchId?: string;
}

// Dashboard summary types
export interface DashboardSummary {
  totalStockValue: number;
  totalSellingValue: number;
  potentialGrossProfit: number;
  todayCashSales: number;
  todayCreditSales: number;
  todayPaymentsReceived: number;
  todayExpenses: number;
  netCashMovement: number;
  phonesInStock: number;
  accessoriesInStock: number;
  availableForSale: number;
  reserved: number;
  awaitingPayment: number;
  inRepair: number;
  soldToday: number;
}

// Result types for server actions
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// Scanner types
export interface ScanResult {
  type: "IMEI" | "QR" | "BARCODE" | "UNKNOWN";
  value: string;
}

// Form field option
export interface SelectOption {
  label: string;
  value: string;
}
