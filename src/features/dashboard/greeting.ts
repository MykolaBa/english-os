export type GreetingKey = 'night' | 'morning' | 'afternoon' | 'evening'

export function greetingFor(date: Date = new Date()): GreetingKey {
  const h = date.getHours()
  if (h < 5) return 'night'
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}
