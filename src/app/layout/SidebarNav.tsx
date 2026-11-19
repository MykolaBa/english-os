import { NavLink } from 'react-router'
import { Badge } from '@/components/ui'
import { useT } from '@/i18n'
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
  const t = useT()
  return (
    <div className={styles.sidebar}>
      <div className={styles.brand}>
        <Logo />
      </div>
      <nav className={styles.nav} aria-label={t.common.mainNav}>
        {NAV_GROUPS.map((group) => (
          <div key={group.id} className={styles.group}>
            <p className={styles.groupLabel}>{t.nav.groups[group.id]}</p>
            <ul>
              {group.items.map(({ id, path, icon: Icon }) => (
                <li key={id}>
                  <NavLink
                    to={path}
                    end={path === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) => cx(styles.link, isActive && styles.active)}
                  >
                    <Icon className={styles.icon} aria-hidden />
                    <span className={styles.label}>{t.nav.items[id].label}</span>
                    {id === 'review' && dueCount > 0 && (
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
