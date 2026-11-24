/**
 * Runtime type guards for values we don't control: URL params, <select> values,
 * data read back from IndexedDB. They replace `as` casts, which only silence the
 * compiler — a guard actually checks the value, so the narrowed type is true.
 */

/** Narrows `value` to one of `options` (a readonly tuple/array of literals). */
export function isOneOf<const T extends readonly unknown[]>(
  options: T,
  value: unknown,
): value is T[number] {
  // The single, contained widening: `includes` on a literal tuple only accepts its members.
  return (options as readonly unknown[]).includes(value)
}

/** `value` if it is one of `options`, otherwise `null`. Handy with `??` for defaults. */
export function parseOneOf<const T extends readonly unknown[]>(
  options: T,
  value: unknown,
): T[number] | null {
  return isOneOf(options, value) ? value : null
}

/** A plain object (or array) whose properties can be read safely. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}
