import { NavLink } from 'react-router'
import { Badge } from '@/components/ui'
import { cx } from '@/lib/cx'
import { NAV_GROUPS } from '../navigation'
import { Logo } from './Logo'
import styles from './SidebarNav.module.scss'

interface SidebarNavProps {
  /** Number shown next to "Review" — words due now. */
  dueCount: number
  onNavigate?: () => void
}

export function SidebarNav({ dueCount, onNavigate }: SidebarNavProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>
        <Logo />
      </div>
      <nav className={styles.nav} aria-label="Main">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className={styles.group}>
            <p className={styles.groupLabel}>{group.label}</p>
            <ul>
              {group.items.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    end={path === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) => cx(styles.link, isActive && styles.active)}
                  >
                    <Icon className={styles.icon} aria-hidden />
                    <span className={styles.label}>{label}</span>
                    {path === '/review' && dueCount > 0 && (
                      <Badge tone="accent" className={styles.count}>
                        {dueCount}
                      </Badge>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}
