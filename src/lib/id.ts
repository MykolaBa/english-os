/** Random unique id for user-created records. Seeded content uses stable `seed:*` ids instead. */
export function createId(): string {
  return crypto.randomUUID()
}
