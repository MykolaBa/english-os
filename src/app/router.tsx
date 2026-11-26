import { lazy } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppLayout } from './layout/AppLayout'
import { NAV_ITEMS } from './navigation'

// Each page is a separate chunk: the phone downloads only what it opens.
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'))
const VocabularyPage = lazy(() => import('@/features/vocabulary/VocabularyPage'))
const WordDetailPage = lazy(() => import('@/features/vocabulary/WordDetailPage'))
const ReviewPage = lazy(() => import('@/features/review/ReviewPage'))
const GrammarPage = lazy(() => import('@/features/grammar/GrammarPage'))
const LessonPage = lazy(() => import('@/features/grammar/LessonPage'))
const QuizzesPage = lazy(() => import('@/features/quizzes/QuizzesPage'))
const ReadingPage = lazy(() => import('@/features/reading/ReadingPage'))
const ReadingTextPage = lazy(() => import('@/features/reading/ReadingTextPage'))
const ItEnglishPage = lazy(() => import('@/features/itEnglish/ItEnglishPage'))
const PhraseSetPage = lazy(() => import('@/features/itEnglish/PhraseSetPage'))
const MockInterviewPage = lazy(() => import('@/features/itEnglish/MockInterviewPage'))
const InterviewPage = lazy(() => import('@/features/itEnglish/InterviewPage'))
const WritingPage = lazy(() => import('@/features/writing/WritingPage'))
const WritingEditorPage = lazy(() => import('@/features/writing/WritingEditorPage'))
const SpeakingPage = lazy(() => import('@/features/speaking/SpeakingPage'))
const ShadowingPage = lazy(() => import('@/features/speaking/ShadowingPage'))
const SpeakingTaskPage = lazy(() => import('@/features/speaking/SpeakingTaskPage'))
const ListeningPage = lazy(() => import('@/features/listening/ListeningPage'))
const EpisodePage = lazy(() => import('@/features/listening/EpisodePage'))
const PlannerPage = lazy(() => import('@/features/planner/PlannerPage'))
const LibraryPage = lazy(() => import('@/features/library/LibraryPage'))
const LibraryItemPage = lazy(() => import('@/features/library/LibraryItemPage'))
const StatisticsPage = lazy(() => import('@/features/statistics/StatisticsPage'))
const ComingSoonPage = lazy(() => import('@/features/placeholder/ComingSoonPage'))
const NotFoundPage = lazy(() => import('@/features/placeholder/NotFoundPage'))

/** Implemented modules. Anything in the nav but not here renders the roadmap placeholder. */
const PAGES: Record<string, RouteObject['element']> = {
  '/': <DashboardPage />,
  '/planner': <PlannerPage />,
  '/statistics': <StatisticsPage />,
  '/vocabulary': <VocabularyPage />,
  '/review': <ReviewPage />,
  '/grammar': <GrammarPage />,
  '/quizzes': <QuizzesPage />,
  '/reading': <ReadingPage />,
  '/it-english': <ItEnglishPage />,
  '/writing': <WritingPage />,
  '/speaking': <SpeakingPage />,
  '/listening': <ListeningPage />,
  '/library': <LibraryPage />,
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
      { path: '/grammar/:lessonId', element: <LessonPage /> },
      { path: '/reading/:textId', element: <ReadingTextPage /> },
      { path: '/it-english/phrases/:setId', element: <PhraseSetPage /> },
      { path: '/it-english/interview/:questionId', element: <InterviewPage /> },
      { path: '/it-english/mock', element: <MockInterviewPage /> },
      { path: '/writing/:writingId', element: <WritingEditorPage /> },
      { path: '/speaking/shadow/:setId', element: <ShadowingPage /> },
      { path: '/speaking/task/:taskId', element: <SpeakingTaskPage /> },
      { path: '/listening/:episodeId', element: <EpisodePage /> },
      { path: '/library/:itemId', element: <LibraryItemPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
