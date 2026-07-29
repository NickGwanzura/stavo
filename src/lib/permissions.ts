/**
 * Permission definitions for the Cellphone Dealer Management Platform.
 * Each permission is a string key used for server-side and client-side checks.
 */

export const Permissions = {
  // Inventory
  INVENTORY_VIEW: "inventory:view",
  INVENTORY_CREATE: "inventory:create",
  INVENTORY_EDIT: "inventory:edit",
  INVENTORY_DELETE: "inventory:delete",
  INVENTORY_TRANSFER: "inventory:transfer",
  INVENTORY_COUNT: "inventory:count",
  INVENTORY_WRITE_OFF: "inventory:write_off",
  INVENTORY_PRINT_LABEL: "inventory:print_label",
  INVENTORY_BULK_UPDATE: "inventory:bulk_update",

  // IMEI
  IMEI_SCAN: "imei:scan",
  IMEI_EDIT: "imei:edit",

  // Pricing
  PRICE_VIEW_COST: "price:view_cost",
  PRICE_EDIT: "price:edit",
  PRICE_DISCOUNT: "price:discount",
  PRICE_DISCOUNT_APPROVE: "price:discount_approve",
  PRICE_BULK_UPDATE: "price:bulk_update",

  // Customers
  CUSTOMER_VIEW: "customer:view",
  CUSTOMER_CREATE: "customer:create",
  CUSTOMER_EDIT: "customer:edit",
  CUSTOMER_DELETE: "customer:delete",

  // Quotations
  QUOTATION_VIEW: "quotation:view",
  QUOTATION_CREATE: "quotation:create",
  QUOTATION_EDIT: "quotation:edit",
  QUOTATION_DELETE: "quotation:delete",
  QUOTATION_CONVERT: "quotation:convert",
  QUOTATION_APPROVE: "quotation:approve",

  // Invoices & Sales
  INVOICE_VIEW: "invoice:view",
  INVOICE_CREATE: "invoice:create",
  INVOICE_EDIT: "invoice:edit",
  INVOICE_CANCEL: "invoice:cancel",
  INVOICE_REFUND: "invoice:refund",
  SALE_CREATE: "sale:create",
  SALE_RETURN: "sale:return",
  SALE_VIEW_ALL: "sale:view_all",

  // Payments
  PAYMENT_CREATE: "payment:create",
  PAYMENT_REFUND: "payment:refund",
  PAYMENT_REVERSE: "payment:reverse",
  PAYMENT_VIEW_ALL: "payment:view_all",

  // Trade-Ins
  TRADE_IN_ASSESS: "trade_in:assess",
  TRADE_IN_APPROVE: "trade_in:approve",
  TRADE_IN_REJECT: "trade_in:reject",

  // Testing & Repairs
  TEST_DEVICE: "test:device",
  REPAIR_MANAGE: "repair:manage",

  // Warranty
  WARRANTY_VIEW: "warranty:view",
  WARRANTY_CREATE: "warranty:create",
  WARRANTY_CLAIM: "warranty:claim",

  // Reservations
  RESERVATION_VIEW: "reservation:view",
  RESERVATION_CREATE: "reservation:create",
  RESERVATION_CANCEL: "reservation:cancel",

  // Instalments
  INSTALMENT_VIEW: "instalment:view",
  INSTALMENT_CREATE: "instalment:create",

  // Suppliers
  SUPPLIER_VIEW: "supplier:view",
  SUPPLIER_CREATE: "supplier:create",
  SUPPLIER_EDIT: "supplier:edit",

  // Purchases
  PURCHASE_VIEW: "purchase:view",
  PURCHASE_CREATE: "purchase:create",
  PURCHASE_RECEIVE: "purchase:receive",

  // Expenses
  EXPENSE_VIEW: "expense:view",
  EXPENSE_CREATE: "expense:create",
  EXPENSE_EDIT: "expense:edit",
  EXPENSE_APPROVE: "expense:approve",
  EXPENSE_VIEW_ALL: "expense:view_all",

  // Financial
  FINANCE_VIEW: "finance:view",
  FINANCE_MANAGE_ACCOUNTS: "finance:manage_accounts",
  FINANCE_TRANSFER: "finance:transfer",
  FINANCE_CASH_UP: "finance:cash_up",
  FINANCE_CASH_UP_APPROVE: "finance:cash_up_approve",

  // Reports
  REPORTS_VIEW: "reports:view",
  REPORTS_EXPORT: "reports:export",
  REPORTS_PROFIT: "reports:profit",

  // Users
  USER_MANAGE: "user:manage",
  USER_VIEW: "user:view",

  // Settings
  SETTINGS_VIEW: "settings:view",
  SETTINGS_EDIT: "settings:edit",

  // Audit
  AUDIT_VIEW: "audit:view",

  // Stock Counts
  STOCK_COUNT_VIEW: "stock_count:view",
  STOCK_COUNT_CREATE: "stock_count:create",
  STOCK_COUNT_APPROVE: "stock_count:approve",
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

/**
 * Role-based permission definitions.
 * Each role maps to an array of permissions.
 */

export type RoleName =
  | "Owner"
  | "Manager"
  | "Salesperson"
  | "InventoryClerk"
  | "Technician"
  | "Accountant"
  | "Auditor";

export const RolePermissions: Record<RoleName, Permission[]> = {
  Owner: Object.values(Permissions),

  Manager: [
    Permissions.INVENTORY_VIEW,
    Permissions.INVENTORY_CREATE,
    Permissions.INVENTORY_EDIT,
    Permissions.INVENTORY_TRANSFER,
    Permissions.INVENTORY_COUNT,
    Permissions.INVENTORY_WRITE_OFF,
    Permissions.INVENTORY_PRINT_LABEL,
    Permissions.INVENTORY_BULK_UPDATE,
    Permissions.IMEI_SCAN,
    Permissions.IMEI_EDIT,
    Permissions.PRICE_VIEW_COST,
    Permissions.PRICE_EDIT,
    Permissions.PRICE_DISCOUNT,
    Permissions.PRICE_DISCOUNT_APPROVE,
    Permissions.PRICE_BULK_UPDATE,
    Permissions.CUSTOMER_VIEW,
    Permissions.CUSTOMER_CREATE,
    Permissions.CUSTOMER_EDIT,
    Permissions.QUOTATION_VIEW,
    Permissions.QUOTATION_CREATE,
    Permissions.QUOTATION_EDIT,
    Permissions.QUOTATION_CONVERT,
    Permissions.QUOTATION_APPROVE,
    Permissions.INVOICE_VIEW,
    Permissions.INVOICE_CREATE,
    Permissions.INVOICE_EDIT,
    Permissions.INVOICE_CANCEL,
    Permissions.INVOICE_REFUND,
    Permissions.SALE_CREATE,
    Permissions.SALE_RETURN,
    Permissions.SALE_VIEW_ALL,
    Permissions.PAYMENT_CREATE,
    Permissions.PAYMENT_REFUND,
    Permissions.TRADE_IN_ASSESS,
    Permissions.TRADE_IN_APPROVE,
    Permissions.TEST_DEVICE,
    Permissions.REPAIR_MANAGE,
    Permissions.WARRANTY_VIEW,
    Permissions.WARRANTY_CREATE,
    Permissions.WARRANTY_CLAIM,
    Permissions.RESERVATION_VIEW,
    Permissions.RESERVATION_CREATE,
    Permissions.RESERVATION_CANCEL,
    Permissions.INSTALMENT_VIEW,
    Permissions.INSTALMENT_CREATE,
    Permissions.SUPPLIER_VIEW,
    Permissions.SUPPLIER_CREATE,
    Permissions.SUPPLIER_EDIT,
    Permissions.PURCHASE_VIEW,
    Permissions.PURCHASE_CREATE,
    Permissions.PURCHASE_RECEIVE,
    Permissions.EXPENSE_VIEW,
    Permissions.EXPENSE_CREATE,
    Permissions.EXPENSE_APPROVE,
    Permissions.FINANCE_VIEW,
    Permissions.FINANCE_CASH_UP,
    Permissions.FINANCE_CASH_UP_APPROVE,
    Permissions.REPORTS_VIEW,
    Permissions.REPORTS_EXPORT,
    Permissions.REPORTS_PROFIT,
    Permissions.USER_VIEW,
    Permissions.STOCK_COUNT_VIEW,
    Permissions.STOCK_COUNT_CREATE,
    Permissions.STOCK_COUNT_APPROVE,
  ],

  Salesperson: [
    Permissions.INVENTORY_VIEW,
    Permissions.IMEI_SCAN,
    Permissions.PRICE_DISCOUNT,
    Permissions.CUSTOMER_VIEW,
    Permissions.CUSTOMER_CREATE,
    Permissions.CUSTOMER_EDIT,
    Permissions.QUOTATION_VIEW,
    Permissions.QUOTATION_CREATE,
    Permissions.QUOTATION_EDIT,
    Permissions.QUOTATION_CONVERT,
    Permissions.INVOICE_VIEW,
    Permissions.INVOICE_CREATE,
    Permissions.SALE_CREATE,
    Permissions.SALE_RETURN,
    Permissions.PAYMENT_CREATE,
    Permissions.RESERVATION_VIEW,
    Permissions.RESERVATION_CREATE,
    Permissions.RESERVATION_CANCEL,
    Permissions.TRADE_IN_ASSESS,
  ],

  InventoryClerk: [
    Permissions.INVENTORY_VIEW,
    Permissions.INVENTORY_CREATE,
    Permissions.INVENTORY_EDIT,
    Permissions.INVENTORY_TRANSFER,
    Permissions.INVENTORY_COUNT,
    Permissions.INVENTORY_PRINT_LABEL,
    Permissions.IMEI_SCAN,
    Permissions.IMEI_EDIT,
    Permissions.PRICE_VIEW_COST,
    Permissions.SUPPLIER_VIEW,
    Permissions.PURCHASE_VIEW,
    Permissions.PURCHASE_RECEIVE,
    Permissions.STOCK_COUNT_VIEW,
    Permissions.STOCK_COUNT_CREATE,
  ],

  Technician: [
    Permissions.INVENTORY_VIEW,
    Permissions.IMEI_SCAN,
    Permissions.TEST_DEVICE,
    Permissions.REPAIR_MANAGE,
    Permissions.WARRANTY_VIEW,
    Permissions.WARRANTY_CLAIM,
  ],

  Accountant: [
    Permissions.INVOICE_VIEW,
    Permissions.PAYMENT_CREATE,
    Permissions.EXPENSE_VIEW,
    Permissions.EXPENSE_CREATE,
    Permissions.EXPENSE_EDIT,
    Permissions.EXPENSE_VIEW_ALL,
    Permissions.FINANCE_VIEW,
    Permissions.FINANCE_MANAGE_ACCOUNTS,
    Permissions.FINANCE_TRANSFER,
    Permissions.FINANCE_CASH_UP,
    Permissions.REPORTS_VIEW,
    Permissions.REPORTS_EXPORT,
    Permissions.REPORTS_PROFIT,
    Permissions.SUPPLIER_VIEW,
    Permissions.SUPPLIER_CREATE,
    Permissions.SUPPLIER_EDIT,
    Permissions.PURCHASE_VIEW,
    Permissions.STOCK_COUNT_VIEW,
    Permissions.INSTALMENT_VIEW,
    Permissions.AUDIT_VIEW,
  ],

  Auditor: [
    Permissions.INVENTORY_VIEW,
    Permissions.CUSTOMER_VIEW,
    Permissions.QUOTATION_VIEW,
    Permissions.INVOICE_VIEW,
    Permissions.SALE_VIEW_ALL,
    Permissions.PAYMENT_VIEW_ALL,
    Permissions.EXPENSE_VIEW,
    Permissions.FINANCE_VIEW,
    Permissions.REPORTS_VIEW,
    Permissions.REPORTS_EXPORT,
    Permissions.REPORTS_PROFIT,
    Permissions.USER_VIEW,
    Permissions.AUDIT_VIEW,
    Permissions.WARRANTY_VIEW,
    Permissions.SUPPLIER_VIEW,
    Permissions.PURCHASE_VIEW,
    Permissions.STOCK_COUNT_VIEW,
    Permissions.RESERVATION_VIEW,
    Permissions.INSTALMENT_VIEW,
  ],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(
  roleName: string,
  permission: Permission
): boolean {
  const rolePerms = RolePermissions[roleName as RoleName];
  if (!rolePerms) return false;
  return rolePerms.includes(permission);
}
