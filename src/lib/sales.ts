export const paymentMethods = [
  { code: "CASH", label: "Cash", accountType: "CASH" },
  { code: "ECOCASH", label: "EcoCash", accountType: "ECOCASH" },
  { code: "ONEMONEY", label: "OneMoney", accountType: "ONEMONEY" },
  { code: "INNBUCKS", label: "InnBucks", accountType: "INNBUCKS" },
  { code: "BANK", label: "Bank Transfer / ZIPIT", accountType: "BANK" },
  { code: "CARD", label: "Card / Swipe", accountType: "CARD" },
] as const;

export type PaymentMethodCode = (typeof paymentMethods)[number]["code"];

export function getPaymentAccountType(code: PaymentMethodCode): string {
  const method = paymentMethods.find((candidate) => candidate.code === code);
  if (!method) throw new Error("UNSUPPORTED_PAYMENT_METHOD");
  return method.accountType;
}

export function formatDocumentNumber(prefix: string, sequence: number): string {
  return `${prefix}-${String(sequence).padStart(5, "0")}`;
}
