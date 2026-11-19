import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { Toaster } from '@/components/ui'
import { seedStarterVocabulary } from '@/features/vocabulary/seed'
import { requestPersistentStorage } from '@/lib/storage/persistence'
import { router } from './router'
import { useDocumentSync } from './useDocumentSync'

export function App() {
  useDocumentSync()

  useEffect(() => {
    void requestPersistentStorage()
    // One-time import of starter words; idempotent, so safe on every start.
    seedStarterVocabulary().catch((err) => console.error('[EnglishOS] Seeding failed', err))
  }, [])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}
