import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cx } from '@/lib/cx'
import styles from './Button.module.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  /** Square button with only an icon. Requires `aria-label`. */
  iconOnly?: boolean
  fullWidth?: boolean
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>

function classes(
  { variant = 'secondary', size = 'md', iconOnly, fullWidth }: CommonProps,
  extra?: string,
) {
  return cx(
    styles.button,
    styles[variant],
    styles[size],
    iconOnly && styles.iconOnly,
    fullWidth && styles.fullWidth,
    extra,
  )
}

export function Button({
  variant,
  size,
  icon,
  iconOnly,
  fullWidth,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classes({ variant, size, iconOnly, fullWidth }, className)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

type ButtonLinkProps = CommonProps & LinkProps

/** Looks like a button, navigates like a link. */
export function ButtonLink({
  variant,
  size,
  icon,
  iconOnly,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={classes({ variant, size, iconOnly, fullWidth }, className)} {...rest}>
      {icon}
      {children}
    </Link>
  )
}
