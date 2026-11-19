import { act, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { en } from '@/i18n/en'
import { uk } from '@/i18n/uk'
import { useSettings } from '@/stores/settingsStore'
import { NAV_ITEMS } from '../navigation'
import { AppLayout } from './AppLayout'

function renderLayout() {
  const router = createMemoryRouter([
    { path: '/', element: <AppLayout />, children: [{ index: true, element: <p>Home</p> }] },
  ])
  render(<RouterProvider router={router} />)
}

describe('AppLayout', () => {
  afterEach(() => useSettings.getState().reset())

  it('renders every navigation section in the sidebar', () => {
    renderLayout()
    const sidebar = screen.getByRole('navigation', { name: en.common.mainNav })
    for (const item of NAV_ITEMS) {
      expect(sidebar).toHaveTextContent(en.nav.items[item.id].label)
    }
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('switches the interface to Ukrainian', () => {
    renderLayout()
    act(() => useSettings.getState().update({ uiLanguage: 'uk' }))
    const sidebar = screen.getByRole('navigation', { name: uk.common.mainNav })
    expect(sidebar).toHaveTextContent(uk.nav.items.vocabulary.label)
    expect(sidebar).toHaveTextContent(uk.nav.groups.learn)
  })
})
