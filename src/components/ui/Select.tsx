import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './Select.module.scss'

export interface SelectOption<T extends string> {
  value: T
  label: string
  icon?: ReactNode
}

interface SelectProps<T extends string> {
  value: T
  options: ReadonlyArray<SelectOption<T>>
  onChange: (value: T) => void
  /** Accessible name when there is no visible label (e.g. toolbar filters). */
  'aria-label'?: string
  /** Id of a visible label element; used by SelectField. */
  labelId?: string
  id?: string
  /** `field` = full-width form control, `pill` = compact toolbar filter. */
  variant?: 'field' | 'pill'
  className?: string
}

const LIST_GAP = 6
const LIST_MAX = 300

/**
 * A select whose open list matches the app (a native <select> list is drawn by the OS).
 * WAI-ARIA "select-only combobox": a button that opens a listbox; focus stays on the button
 * and `aria-activedescendant` points at the highlighted option.
 * Keys: ↑/↓, Home/End, Enter/Space to choose, Esc/Tab to close, letters jump to an option.
 * The list is `position: fixed`, so it is never clipped by a scrolling dialog body.
 */
export function Select<T extends string>({
  value,
  options,
  onChange,
  labelId,
  id,
  variant = 'field',
  className,
  'aria-label': ariaLabel,
}: SelectProps<T>) {
  const baseId = useId()
  const triggerId = id ?? `${baseId}-trigger`
  const listId = `${baseId}-list`
  const valueId = `${baseId}-value`
  const optionId = (i: number) => `${baseId}-opt-${i}`

  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typeahead = useRef({ text: '', at: 0 })
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [position, setPosition] = useState<CSSProperties>({})

  const foundIndex = options.findIndex((o) => o.value === value)
  const selectedIndex = Math.max(0, foundIndex)
  // A value missing from the options is shown as-is, never as some other option.
  const selected = foundIndex >= 0 ? options[foundIndex] : { label: value, icon: undefined }

  const openList = () => {
    setActive(selectedIndex)
    setOpen(true)
  }
  const close = () => setOpen(false)
  const choose = (i: number) => {
    const option = options[i]
    if (option && option.value !== value) onChange(option.value)
    close()
    triggerRef.current?.focus()
  }

  // Place the list under the trigger, or above it when there's more room there.
  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      // On phones the bottom tab bar covers the end of the viewport; keep the list above it.
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
  }, [open])

  // Close on a press outside, or when the page (not the list itself) scrolls.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!listRef.current?.contains(target) && !triggerRef.current?.contains(target)) close()
    }
    const onScroll = (e: Event) => {
      if (!listRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('scroll', onScroll, true)
    }
  }, [open])

  // Keep the highlighted option visible while moving with the keyboard.
  useEffect(() => {
    if (open)
      document.getElementById(`${baseId}-opt-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, baseId])

  const jumpTo = (key: string) => {
    const now = Date.now()
    const t = typeahead.current
    t.text = now - t.at < 700 ? t.text + key.toLowerCase() : key.toLowerCase()
    t.at = now
    const start = open ? active + (t.text.length === 1 ? 1 : 0) : selectedIndex + 1
    for (let k = 0; k < options.length; k++) {
      const i = (start + k) % options.length
      if (options[i]?.label.toLowerCase().startsWith(t.text)) {
        if (open) setActive(i)
        else if (options[i]) onChange(options[i].value)
        return
      }
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openList()
      } else if (e.key.length === 1 && /\S/.test(e.key)) {
        jumpTo(e.key)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActive((i) => Math.min(last, i + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((i) => Math.max(0, i - 1))
        break
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(last)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        choose(active)
        break
      case 'Escape':
        // Close only the list, not a dialog the select lives in.
        e.preventDefault()
        e.stopPropagation()
        close()
        break
      case 'Tab':
        close()
        break
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) jumpTo(e.key)
    }
  }

  return (
    <div className={cx(styles.root, styles[variant], className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-label={labelId ? undefined : ariaLabel}
        aria-labelledby={labelId ? `${labelId} ${valueId}` : undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
      >
        {selected?.icon}
        <span id={valueId} className={styles.value}>
          {selected?.label}
        </span>
        <ChevronDown className={cx(styles.chevron, open && styles.chevronOpen)} aria-hidden />
      </button>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className={styles.list}
          style={position}
          aria-labelledby={labelId}
          aria-label={labelId ? undefined : ariaLabel}
          tabIndex={-1}
        >
          {options.map((option, i) => (
            <li
              key={option.value}
              id={optionId(i)}
              role="option"
              aria-selected={option.value === value}
              className={cx(styles.option, i === active && styles.active)}
              onPointerMove={() => setActive(i)}
              // Keep focus on the trigger; choose on click.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
            >
              {option.icon}
              <span className={styles.optionLabel}>{option.label}</span>
              {option.value === value && <Check className={styles.check} aria-hidden />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
