import { useEffect } from 'react'
import { useSettings } from '@/stores/settingsStore'

/** Mirrors the theme preference onto <html data-theme> where the CSS tokens pick it up. */
export function useThemeSync() {
  const theme = useSettings((s) => s.theme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const isLight =
      theme === 'light' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isLight ? '#f6f7fb' : '#0b0d12')
  }, [theme])
}
