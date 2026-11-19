import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { DEFAULT_FILTERS, filtersFromParams, filtersToParams, type WordFilters } from './filters'

/**
 * Filters live in the URL (?q=…&level=B1): the back button restores them, and a filtered
 * view can be bookmarked. `replace` avoids a history entry per keystroke.
 */
export function useWordFilters() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => filtersFromParams(params), [params])

  const update = useCallback(
    (patch: Partial<WordFilters>) =>
      setParams((prev) => filtersToParams({ ...filtersFromParams(prev), ...patch }), {
        replace: true,
      }),
    [setParams],
  )

  const clear = useCallback(
    () => setParams(filtersToParams({ ...DEFAULT_FILTERS, sort: filters.sort }), { replace: true }),
    [setParams, filters.sort],
  )

  return { filters, update, clear, params, setParams }
}
