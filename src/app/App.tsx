import { RouterProvider } from 'react-router'
import { Toaster } from '@/components/ui'
import { router } from './router'
import { useDocumentSync } from './useDocumentSync'

export function App() {
  useDocumentSync()

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}
