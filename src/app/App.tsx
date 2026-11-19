import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { Toaster } from '@/components/ui'
import { requestPersistentStorage } from '@/lib/storage/persistence'
import { router } from './router'
import { useDocumentSync } from './useDocumentSync'

export function App() {
  useDocumentSync()

  useEffect(() => {
    void requestPersistentStorage()
  }, [])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}
