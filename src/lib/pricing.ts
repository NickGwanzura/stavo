/**
 * Pricing utility functions for the cellphone dealer platform.
 */

export interface LandedCost {
  purchasePrice: number;
  shipping: number;
  customs: number;
  repair: number;
  transport: number;
  commission: number;
  other: number;
}

/**
 * Calculate the total landed cost from individual cost components.
 */
export function calculateLandedCost(costs: LandedCost): number {
  return (
    costs.purchasePrice +
    costs.shipping +
    costs.customs +
    costs.repair +
    costs.transport +
    costs.commission +
    costs.other
  );
}

/**
 * Calculate the recommended selling price based on landed cost and target markup.
 */
export function calculateSellingPrice(
  landedCost: number,
  markupPercentage: number
): number {
  return landedCost * (1 + markupPercentage / 100);
}

/**
 * Calculate gross profit.
 * Gross Profit = Selling Price - Landed Cost
 */
export function calculateGrossProfit(
  sellingPrice: number,
  landedCost: number
): number {
  return sellingPrice - landedCost;
}

/**
 * Calculate gross margin percentage.
 * Gross Margin % = (Selling Price - Landed Cost) / Selling Price * 100
 */
export function calculateGrossMargin(
  sellingPrice: number,
  landedCost: number
): number {
  if (sellingPrice === 0) return 0;
  return ((sellingPrice - landedCost) / sellingPrice) * 100;
}

/**
 * Round a price to the nearest increment.
 * e.g., round to nearest $5: roundPrice(123, 5) = 125
 */
export function roundPrice(price: number, increment: number): number {
  return Math.round(price / increment) * increment;
}

/**
 * Common rounding rules used by dealers.
 */
export const ROUNDING_RULES = {
  USD_5: 5,
  USD_10: 10,
  USD_20: 20,
  USD_50: 50,
  NONE: 1,
};

/**
 * Calculate instalment amount.
 */
export function calculateInstalment(
  totalPrice: number,
  deposit: number,
  numberOfInstalments: number,
  interestRate: number = 0
): {
  instalmentAmount: number;
  totalPayable: number;
  outstandingBalance: number;
} {
  const outstandingBalance = totalPrice - deposit;
  const interestMultiplier = 1 + interestRate / 100;
  const totalPayable = outstandingBalance * interestMultiplier;
  const instalmentAmount = totalPayable / numberOfInstalments;

  return {
    instalmentAmount: Math.ceil(instalmentAmount * 100) / 100,
    totalPayable: Math.ceil(totalPayable * 100) / 100,
    outstandingBalance,
  };
}
