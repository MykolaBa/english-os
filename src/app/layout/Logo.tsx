import { useId } from 'react'
import styles from './Logo.module.scss'

export function Logo() {
  // Unique per instance: the logo renders in several places and SVG ids are document-global.
  const gradientId = useId()
  return (
    <span className={styles.logo}>
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b7cf8" />
            <stop offset="55%" stopColor="#5b8def" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
        <path
          d="M11 9.5h10M11 16h7.5M11 22.5h10M11 9.5v13"
          stroke="#0b0d12"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className={styles.word}>
        English<span>OS</span>
      </span>
    </span>
  )
}
