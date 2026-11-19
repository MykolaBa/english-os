import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { NAV_ITEMS } from '../navigation'
import { AppLayout } from './AppLayout'

describe('AppLayout', () => {
  it('renders every navigation section in the sidebar', () => {
    const router = createMemoryRouter([
      { path: '/', element: <AppLayout />, children: [{ index: true, element: <p>Home</p> }] },
    ])
    render(<RouterProvider router={router} />)

    const sidebar = screen.getByRole('navigation', { name: 'Main' })
    for (const item of NAV_ITEMS) {
      expect(sidebar).toHaveTextContent(item.label)
    }
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
