import {
  useId,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { cx } from '@/lib/cx'
import { Select, type SelectOption } from './Select'
import styles from './Field.module.scss'

interface FieldShellProps {
  label: string
  hint?: ReactNode
  error?: string
  id: string
  children: ReactNode
}

function FieldShell({ label, hint, error, id, children }: FieldShellProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} id={`${id}-label`} className={styles.label}>
        {label}
      </label>
      {children}
      {error ? (
        <p className={styles.error} id={`${id}-msg`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className={styles.hint} id={`${id}-msg`}>
            {hint}
          </p>
        )
      )}
    </div>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: ReactNode
  error?: string
}

export function TextField({ label, hint, error, className, id, ...rest }: TextFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell label={label} hint={hint} error={error} id={fieldId}>
      <input
        id={fieldId}
        className={cx(styles.control, error && styles.invalid, className)}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${fieldId}-msg` : undefined}
        {...rest}
      />
    </FieldShell>
  )
}

interface SelectFieldProps<T extends string> {
  label: string
  hint?: ReactNode
  value: T
  options: ReadonlyArray<SelectOption<T>>
  onChange: (value: T) => void
  id?: string
}

/** Labelled `Select` with the same layout as the other form fields. */
export function SelectField<T extends string>({ label, hint, id, ...rest }: SelectFieldProps<T>) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell label={label} hint={hint} id={fieldId}>
      <Select id={fieldId} labelId={`${fieldId}-label`} {...rest} />
    </FieldShell>
  )
}

interface SwitchProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/** Accessible toggle: a real checkbox with role="switch", styled as a pill. */
export function Switch({ label, description, checked, onChange }: SwitchProps) {
  const id = useId()
  return (
    <div className={styles.switchRow}>
      <div className={styles.switchText}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        {description && <p className={styles.hint}>{description}</p>}
      </div>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.switch}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  )
}

interface SegmentedProps<T extends string> {
  label: string
  value: T
  options: ReadonlyArray<{ value: T; label: string; icon?: ReactNode }>
  onChange: (value: T) => void
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.segmented} role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            className={cx(styles.segment, value === o.value && styles.segmentActive)}
            onClick={() => onChange(o.value)}
          >
            {o.icon}
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: ReactNode
  error?: string
}

export function TextAreaField({
  label,
  hint,
  error,
  className,
  id,
  rows = 3,
  ...rest
}: TextAreaFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell label={label} hint={hint} error={error} id={fieldId}>
      <textarea
        id={fieldId}
        rows={rows}
        className={cx(styles.control, styles.textarea, error && styles.invalid, className)}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${fieldId}-msg` : undefined}
        {...rest}
      />
    </FieldShell>
  )
}

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  selected: boolean
  icon?: ReactNode
  count?: number
}

/** Toggle pill (filters, multi-select). Exposes its state via aria-pressed. */
export function Chip({ selected, icon, count, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(styles.chip, selected && styles.chipSelected, className)}
      {...rest}
    >
      {icon}
      <span className={styles.chipLabel}>{children}</span>
      {count !== undefined && <span className={styles.chipCount}>{count}</span>}
    </button>
  )
}
