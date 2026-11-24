// Apply the saved theme and language before first paint, to avoid a flash of the wrong
// theme. Values come from localStorage, so only known ones are applied.
try {
  var saved = JSON.parse(localStorage.getItem('englishos:settings') || '{}').state || {}
  if (['dark', 'light', 'system'].indexOf(saved.theme) !== -1)
    document.documentElement.dataset.theme = saved.theme
  if (['en', 'uk'].indexOf(saved.uiLanguage) !== -1)
    document.documentElement.lang = saved.uiLanguage
} catch {
  // Storage blocked or corrupt: the app falls back to the default theme.
}
