// @ts-check

/**
 * Returns an email address that is unique per call, e.g. `user_1712345678901_42@test.com`.
 * @param {string} [prefix]
 */
function uniqueEmail(prefix = 'user') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`;
}

/**
 * Converts a displayed price such as "1590.00" or "Price: 24.00" to a number.
 * @param {string} text
 */
function parsePrice(text) {
  return parseFloat(text.replace(/[^0-9.]/g, ''));
}

/**
 * True when the values are in ascending/descending order (numbers numerically, strings case-insensitively).
 * @param {Array<number | string>} values
 * @param {'asc' | 'desc'} order
 */
function isSorted(values, order) {
  /** @param {number | string} a @param {number | string} b */
  const compare = (a, b) =>
    typeof a === 'number' && typeof b === 'number'
      ? a - b
      : String(a).localeCompare(String(b), 'en', { sensitivity: 'base' });
  return values.every((value, i) => {
    if (i === 0) return true;
    const diff = compare(values[i - 1], value);
    return order === 'asc' ? diff <= 0 : diff >= 0;
  });
}

module.exports = { uniqueEmail, parsePrice, isSorted };
