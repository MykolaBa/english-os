import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Select } from './Select'

const OPTIONS = [
  { value: 'a1', label: 'A1' },
  { value: 'b1', label: 'B1' },
  { value: 'b2', label: 'B2' },
] as const

function Harness() {
  const [value, setValue] = useState<'a1' | 'b1' | 'b2'>('a1')
  return (
    <>
      <Select aria-label="Level" value={value} options={OPTIONS} onChange={setValue} />
      <output>{value}</output>
    </>
  )
}

describe('Select', () => {
  it('opens on click and selects an option', () => {
    render(<Harness />)
    const trigger = screen.getByRole('combobox', { name: 'Level' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('option', { name: 'A1' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(screen.getByRole('option', { name: 'B2' }))
    expect(screen.getByText('b2', { selector: 'output' })).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('supports the keyboard: arrows, Enter, Escape and typing a letter', () => {
    render(<Harness />)
    const trigger = screen.getByRole('combobox', { name: 'Level' })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(trigger.getAttribute('aria-activedescendant')).toMatch(/opt-1$/)
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(screen.getByText('b1', { selector: 'output' })).toBeInTheDocument()

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    fireEvent.keyDown(trigger, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByText('b1', { selector: 'output' })).toBeInTheDocument()

    // Closed + a letter: jumps to the next option starting with it.
    fireEvent.keyDown(trigger, { key: 'b' })
    expect(screen.getByText('b2', { selector: 'output' })).toBeInTheDocument()
  })

  it('closes when pressing outside', () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole('combobox', { name: 'Level' }))
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
