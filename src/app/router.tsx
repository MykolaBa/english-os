import { lazy } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppLayout } from './layout/AppLayout'
import { NAV_ITEMS } from './navigation'

// Each page is a separate chunk: the phone downloads only what it opens.
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'))
const VocabularyPage = lazy(() => import('@/features/vocabulary/VocabularyPage'))
const WordDetailPage = lazy(() => import('@/features/vocabulary/WordDetailPage'))
const ComingSoonPage = lazy(() => import('@/features/placeholder/ComingSoonPage'))
const NotFoundPage = lazy(() => import('@/features/placeholder/NotFoundPage'))

/** Implemented modules. Anything in the nav but not here renders the roadmap placeholder. */
const PAGES: Record<string, RouteObject['element']> = {
  '/': <DashboardPage />,
  '/vocabulary': <VocabularyPage />,
  '/settings': <SettingsPage />,
}

const moduleRoutes: RouteObject[] = NAV_ITEMS.map((item) => ({
  path: item.path,
  element: PAGES[item.path] ?? <ComingSoonPage item={item} />,
}))

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      ...moduleRoutes,
      { path: '/vocabulary/:wordId', element: <WordDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
