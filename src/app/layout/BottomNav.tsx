import { NavLink } from 'react-router'
import { Menu } from 'lucide-react'
import { useT } from '@/i18n'
import { cx } from '@/lib/cx'
import { NAV_ITEMS } from '../navigation'
import styles from './BottomNav.module.scss'

const PRIMARY = NAV_ITEMS.filter((item) => item.mobilePrimary)

interface BottomNavProps {
  dueCount: number
  onOpenMenu: () => void
}

/** Mobile-only tab bar with the most used sections + "More" for the full menu. */
export function BottomNav({ dueCount, onOpenMenu }: BottomNavProps) {
  const t = useT()
  return (
    <nav className={styles.bar} aria-label={t.common.quickNav}>
      {PRIMARY.map(({ id, path, icon: Icon }) => (
        <NavLink
          key={id}
          to={path}
          end={path === '/'}
          className={({ isActive }) => cx(styles.item, isActive && styles.active)}
        >
          <span className={styles.iconWrap}>
            <Icon aria-hidden />
            {id === 'review' && dueCount > 0 && (
              <span className={styles.dot} aria-label={t.common.dueBadge(dueCount)} />
            )}
          </span>
          <span className={styles.text}>{t.nav.items[id].label}</span>
        </NavLink>
      ))}
      <button type="button" className={styles.item} onClick={onOpenMenu}>
        <span className={styles.iconWrap}>
          <Menu aria-hidden />
        </span>
        <span className={styles.text}>{t.common.more}</span>
      </button>
    </nav>
  )
}
