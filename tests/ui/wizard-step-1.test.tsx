import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Step1Page from '@/app/wizard/step-1/page'

describe('Step1Page', () => {
  it('should render the step title', () => {
    render(<Step1Page />)

    expect(screen.getByText('¿Qué ocasión celebráis?')).toBeInTheDocument()
  })

  it('should render all occasion options', () => {
    render(<Step1Page />)

    expect(screen.getByText('Cumpleaños')).toBeInTheDocument()
    expect(screen.getByText('Tarde en familia')).toBeInTheDocument()
    expect(screen.getByText('Fiesta')).toBeInTheDocument()
    expect(screen.getByText('Excursión')).toBeInTheDocument()
  })

  it('should mark card as selected when clicked', async () => {
    const user = userEvent.setup()
    render(<Step1Page />)

    const birthdayCard = screen.getByRole('button', { name: /cumpleaños/i })

    // Initially not selected
    expect(birthdayCard).toHaveAttribute('aria-pressed', 'false')

    // Click to select
    await user.click(birthdayCard)

    // Now selected
    expect(birthdayCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('should only have one card selected at a time', async () => {
    const user = userEvent.setup()
    render(<Step1Page />)

    const birthdayCard = screen.getByRole('button', { name: /cumpleaños/i })
    const partyCard = screen.getByRole('button', { name: /fiesta/i })

    // Select birthday
    await user.click(birthdayCard)
    expect(birthdayCard).toHaveAttribute('aria-pressed', 'true')
    expect(partyCard).toHaveAttribute('aria-pressed', 'false')

    // Select party
    await user.click(partyCard)
    expect(birthdayCard).toHaveAttribute('aria-pressed', 'false')
    expect(partyCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('should display correct step progress', () => {
    render(<Step1Page />)

    expect(screen.getByText('Paso 1 de 5')).toBeInTheDocument()
  })
})
