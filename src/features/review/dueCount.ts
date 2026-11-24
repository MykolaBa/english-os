import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/db'
import { useNow } from '@/lib/useNow'

/**
 * Words already in the review cycle whose time has come. Brand-new words are not "due" —
 * they're introduced gradually by the review session.
 */
export function countDue(now = Date.now()): Promise<number> {
  return db.words
    .where('srs.dueAt')
    .belowOrEqual(now)
    .filter((w) => w.srs.status !== 'new')
    .count()
}

/** The badge on "Review" in the navigation; refreshes as time passes. */
export function useDueCount(): number {
  const now = useNow()
  return useLiveQuery(() => countDue(now), [now]) ?? 0
}
