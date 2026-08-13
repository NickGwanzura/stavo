/**
 * Validate an IMEI number using the Luhn algorithm.
 * IMEI must be exactly 15 digits.
 */
export function validateIMEI(imei: string): boolean {
  // Remove any non-digit characters
  const cleaned = imei.replace(/\D/g, "");

  // IMEI must be exactly 15 digits
  if (cleaned.length !== 15) return false;

  // Luhn algorithm (mod 10)
  let sum = 0;
  for (let i = 0; i < cleaned.length; i++) {
    let digit = parseInt(cleaned[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  return sum % 10 === 0;
}

/**
 * Format an IMEI with spaces for readability (XX-XXXXXX-XXXXXX-X)
 */
export function formatIMEI(imei: string): string {
  const cleaned = imei.replace(/\D/g, "");
  if (cleaned.length !== 15) return imei;
  return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 8)}-${cleaned.slice(8, 14)}-${cleaned.slice(14)}`;
}

/**
 * Extract the TAC (Type Allocation Code) from an IMEI (first 8 digits)
 */
export function getIMEITAC(imei: string): string {
  return imei.replace(/\D/g, "").slice(0, 8);
}
