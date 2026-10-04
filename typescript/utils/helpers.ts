/** Returns an email address that is unique per call, e.g. `user_1712345678901_42@test.com`. */
export function uniqueEmail(prefix = 'user'): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;
}

/** Converts a displayed price such as "1590.00" or "Price: 24.00" to a number. */
export function parsePrice(text: string): number {
  return parseFloat(text.replace(/[^0-9.]/g, ''));
}

/** True when the values are in ascending/descending order (numbers numerically, strings case-insensitively). */
export function isSorted(values: Array<number | string>, order: 'asc' | 'desc'): boolean {
  const compare = (a: number | string, b: number | string): number =>
    typeof a === 'number' && typeof b === 'number'
      ? a - b
      : String(a).localeCompare(String(b), 'en', { sensitivity: 'base' });
  return values.every((value, i) => {
    if (i === 0) return true;
    const diff = compare(values[i - 1], value);
    return order === 'asc' ? diff <= 0 : diff >= 0;
  });
}
