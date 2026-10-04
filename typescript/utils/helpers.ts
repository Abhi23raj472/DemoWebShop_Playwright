export function uniqueEmail(prefix = 'user'): string {
  return `${prefix}_${Date.now()}@test.com`;
}
