import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AgendaList } from './AgendaList'

describe('AgendaList', () => {
  it('labels an untitled item by what to do, not as a review', () => {
    render(
      <MemoryRouter>
        <AgendaList
          items={[
            { kind: 'review', to: '/review', title: null, minutes: 3, done: false },
            { kind: 'writing', to: '/writing', title: null, minutes: 15, done: false },
          ]}
        />
      </MemoryRouter>,
    )
    expect(screen.getAllByText('Review your words')).toHaveLength(1)
    expect(screen.getByText('Choose what to do next')).toBeInTheDocument()
  })
})
