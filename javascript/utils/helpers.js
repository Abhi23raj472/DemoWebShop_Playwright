// @ts-check
/** @param {string} [prefix] */
function uniqueEmail(prefix = 'user') {
  return `${prefix}_${Date.now()}@test.com`;
}

module.exports = { uniqueEmail };
