/**
 * Pluralize filter
 * @param n(number) Number
 * @param unit(string) 'single[ | plural[ | none]]'
 * @returns (string) Number with units (e.g. '1 hour', '2 hours')
 */
export function plural(n: number, unit: string): string {
  const s = unit.split('|').map(v => v.trim());
  if (n === 1 || s.length === 1) return n + ' ' + s[0];
  if (s.length === 3 && n === 0) return n + ' ' + s[2];
  return n + ' ' + s[1];
}

/**
 * Convert a given number to a fixed-digit string
 * @param n number
 * @param digit
 */
export function fixed(n: number, digit: number): string {
  if (digit < 0) return 'Digit cannot be negative';
  return Number(n).toFixed(digit);
}