import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { seedStarterVocabulary } from './features/vocabulary/seed'
import { requestPersistentStorage } from './lib/storage/persistence'
import './styles/global.scss'

// App-wide initialization runs once per page load — here in the entry module, not in a
// component effect (effects re-run on remount and twice in StrictMode).
void requestPersistentStorage()
seedStarterVocabulary().catch((err) => console.error('[EnglishOS] Seeding failed', err))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
