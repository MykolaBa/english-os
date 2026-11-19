import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { X } from 'lucide-react'
import { Button, ErrorBoundary, PageLoader } from '@/components/ui'
import { useDueCount } from '@/features/dashboard/useDashboardData'
import { useT } from '@/i18n'
import { BottomNav } from './BottomNav'
import { Logo } from './Logo'
import { SidebarNav } from './SidebarNav'
import styles from './AppLayout.module.scss'

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const dueCount = useDueCount()
  const t = useT()

  // New page → start at the top (the drawer closes itself via onNavigate).
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <div className={styles.shell}>
      <a href="#main" className={styles.skipLink}>
        {t.common.skipToContent}
      </a>

      <aside className={styles.sidebar}>
        <SidebarNav dueCount={dueCount} />
      </aside>

      <header className={styles.mobileTopbar}>
        <Logo />
      </header>

      {menuOpen && (
        <div className={styles.drawerRoot}>
          <div className={styles.backdrop} onClick={() => setMenuOpen(false)} aria-hidden />
          <aside className={styles.drawer} aria-label={t.common.menu}>
            <Button
              className={styles.drawerClose}
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={t.common.closeMenu}
              icon={<X />}
              onClick={() => setMenuOpen(false)}
            />
            <SidebarNav dueCount={dueCount} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <main id="main" className={styles.main}>
        <div className={styles.content}>
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      <BottomNav dueCount={dueCount} onOpenMenu={() => setMenuOpen(true)} />
    </div>
  )
}
