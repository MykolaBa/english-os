import { useEffect, useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react'

const LIST_GAP = 6
const LIST_MAX = 300

/**
 * Places a `position: fixed` list under its trigger, or above it when there's more room
 * there (on phones the bottom tab bar covers the end of the viewport). Re-placed on resize.
 */
export function useListPosition(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
): CSSProperties {
  const [position, setPosition] = useState<CSSProperties>({})

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      const bar = document.querySelector('nav[data-bottom-nav]')?.getBoundingClientRect()
      const floor = bar && bar.height > 0 ? bar.top : window.innerHeight
      const below = floor - rect.bottom - LIST_GAP
      const above = rect.top - LIST_GAP
      const up = below < Math.min(LIST_MAX, 200) && above > below
      setPosition({
        left: Math.min(rect.left, window.innerWidth - Math.max(rect.width, 180) - 8),
        minWidth: rect.width,
        maxHeight: Math.min(LIST_MAX, up ? above : below) - 8,
        ...(up
          ? { bottom: window.innerHeight - rect.top + LIST_GAP }
          : { top: rect.bottom + LIST_GAP }),
      })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [open, triggerRef])

  return position
}

const isInside = (ref: RefObject<HTMLElement | null>, target: EventTarget | null) =>
  target instanceof Node && Boolean(ref.current?.contains(target))

/** Closes the list on a press outside it and its trigger, or when the page scrolls. */
export function useDismiss(
  open: boolean,
  refs: { list: RefObject<HTMLElement | null>; trigger: RefObject<HTMLElement | null> },
  close: () => void,
) {
  const { list, trigger } = refs
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!isInside(list, e.target) && !isInside(trigger, e.target)) close()
    }
    // Scrolling the list itself is fine; scrolling the page would leave it floating.
    const onScroll = (e: Event) => {
      if (!isInside(list, e.target)) close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('scroll', onScroll, true)
    }
  }, [open, list, trigger, close])
}

/** Index of the first option (from `start`, wrapping) whose label starts with `text`. */
export function findByPrefix(
  labels: readonly string[],
  text: string,
  start: number,
): number | null {
  for (let k = 0; k < labels.length; k++) {
    const i = (start + k) % labels.length
    if (labels[i]?.toLowerCase().startsWith(text)) return i
  }
  return null
}

/** Keyboard moves inside an open list: the next highlighted index for each key. */
export const LIST_MOVES: Partial<Record<string, (index: number, last: number) => number>> = {
  ArrowDown: (i, last) => Math.min(last, i + 1),
  ArrowUp: (i) => Math.max(0, i - 1),
  Home: () => 0,
  End: (_i, last) => last,
}
