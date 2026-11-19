import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { Toaster } from '@/components/ui'
import { requestPersistentStorage } from '@/lib/storage/persistence'
import { router } from './router'
import { useThemeSync } from './useThemeSync'

export function App() {
  useThemeSync()

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
