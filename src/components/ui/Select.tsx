import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cx } from '@/lib/cx'
import { findByPrefix, LIST_MOVES, useDismiss, useListPosition } from './useFloatingList'
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
  const close = useCallback(() => setOpen(false), [])
  const position = useListPosition(open, triggerRef)
  useDismiss(open, { list: listRef, trigger: triggerRef }, close)

  const foundIndex = options.findIndex((o) => o.value === value)
  const selectedIndex = Math.max(0, foundIndex)
  // A value missing from the options is shown as-is, never as some other option.
  const selected = foundIndex >= 0 ? options[foundIndex] : { label: value, icon: undefined }

  const openList = () => {
    setActive(selectedIndex)
    setOpen(true)
  }
  const choose = (i: number) => {
    const option = options[i]
    if (option && option.value !== value) onChange(option.value)
    close()
    triggerRef.current?.focus()
  }

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
    const i = findByPrefix(
      options.map((o) => o.label),
      t.text,
      start,
    )
    const option = i === null ? undefined : options[i]
    if (i === null || !option) return
    if (open) setActive(i)
    else onChange(option.value)
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
    const move = LIST_MOVES[e.key]
    if (move) {
      e.preventDefault()
      setActive((i) => move(i, last))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(active)
    } else if (e.key === 'Escape') {
      // Close only the list, not a dialog the select lives in.
      e.preventDefault()
      e.stopPropagation()
      close()
    } else if (e.key === 'Tab') {
      close()
    } else if (e.key.length === 1 && /\S/.test(e.key)) {
      jumpTo(e.key)
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
