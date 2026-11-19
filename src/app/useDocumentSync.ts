import { useEffect } from 'react'
import { useSettings } from '@/stores/settingsStore'

/**
 * Mirrors preferences onto <html>: `data-theme` for the CSS tokens and `lang` for
 * screen readers, hyphenation and the browser's built-in translation prompt.
 */
export function useDocumentSync() {
  const theme = useSettings((s) => s.theme)
  const language = useSettings((s) => s.uiLanguage)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const isLight =
      theme === 'light' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isLight ? '#f3f3fa' : '#131628')
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])
}
