/**
 * Convert Western digits (0-9) to Persian digits (۰-۹)
 */
export function toPersianDigits(input) {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/\d/g, (d) => map[Number(d)]);
}

/**
 * Format a raw price (number or string) into Persian currency string.
 * Examples:
 *   formatPrice(12500000)      → "۱۲,۵۰۰,۰۰۰ تومان"
 *   formatPrice("12,500,000")  → "۱۲,۵۰۰,۰۰۰ تومان"
 *   formatPrice("۱۲۵۰۰۰۰۰")    → "۱۲,۵۰۰,۰۰۰ تومان"
 *   formatPrice("")            → ""
 */
export function formatPrice(raw) {
  if (raw === null || raw === undefined || raw === '') return '';

  // Convert Persian/Arabic digits to Western, strip anything that's not a digit
  const western = String(raw)
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/\D/g, '');

  if (!western) return '';

  const n = Number(western);
  if (!Number.isFinite(n)) return '';

  // Add thousand separators
  const withCommas = n.toLocaleString('en-US');

  // Convert to Persian digits and append currency
  return `${toPersianDigits(withCommas)} تومان`;
}

/**
 * Extract just the raw number from any input (useful for API payloads).
 * Examples:
 *   parsePrice("۱۲,۵۰۰,۰۰۰ تومان") → "12500000"
 *   parsePrice(12500000)           → "12500000"
 */
export function parsePrice(raw) {
  if (raw === null || raw === undefined) return '';
  return String(raw)
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/\D/g, '');
}