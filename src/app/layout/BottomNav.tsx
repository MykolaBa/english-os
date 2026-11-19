import { NavLink } from 'react-router'
import { Menu } from 'lucide-react'
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
  return (
    <nav className={styles.bar} aria-label="Quick navigation">
      {PRIMARY.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) => cx(styles.item, isActive && styles.active)}
        >
          <span className={styles.iconWrap}>
            <Icon aria-hidden />
            {path === '/review' && dueCount > 0 && (
              <span className={styles.dot} aria-label={`${dueCount} due`} />
            )}
          </span>
          <span>{label}</span>
        </NavLink>
      ))}
      <button type="button" className={styles.item} onClick={onOpenMenu}>
        <span className={styles.iconWrap}>
          <Menu aria-hidden />
        </span>
        <span>More</span>
      </button>
    </nav>
  )
}
