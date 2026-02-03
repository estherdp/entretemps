import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Step4Page from '@/app/wizard/step-4/page'
import { WizardProvider } from '@/ui/wizard/wizard-provider'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<WizardProvider>{ui}</WizardProvider>)
}

describe('Step4Page', () => {
  it('should render the step title', () => {
    renderWithProvider(<Step4Page />)

    expect(screen.getByText('¿Dónde será la aventura?')).toBeInTheDocument()
  })

  it('should render all location options', () => {
    renderWithProvider(<Step4Page />)

    expect(screen.getByText('Casa')).toBeInTheDocument()
    expect(screen.getByText('Jardín')).toBeInTheDocument()
    expect(screen.getByText('Parque')).toBeInTheDocument()
    expect(screen.getByText('Interior')).toBeInTheDocument()
    expect(screen.getByText('Exterior')).toBeInTheDocument()
  })

  it('should render subtitles for each option', () => {
    renderWithProvider(<Step4Page />)

    expect(screen.getByText('Interior del hogar')).toBeInTheDocument()
    expect(screen.getByText('Terraza o patio')).toBeInTheDocument()
    expect(screen.getByText('Espacio al aire libre')).toBeInTheDocument()
    expect(screen.getByText('Ludoteca o local')).toBeInTheDocument()
    expect(screen.getByText('Excursión')).toBeInTheDocument()
  })

  it('should mark "Casa" card as selected when clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Step4Page />)

    const casaCard = screen.getByRole('button', { name: /casa/i })

    // Initially not selected
    expect(casaCard).toHaveAttribute('aria-pressed', 'false')

    // Click to select
    await user.click(casaCard)

    // Now selected
    expect(casaCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('should only have one card selected at a time', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Step4Page />)

    const casaCard = screen.getByRole('button', { name: /casa/i })
    const parqueCard = screen.getByRole('button', { name: /parque/i })

    // Select casa
    await user.click(casaCard)
    expect(casaCard).toHaveAttribute('aria-pressed', 'true')
    expect(parqueCard).toHaveAttribute('aria-pressed', 'false')

    // Select parque
    await user.click(parqueCard)
    expect(casaCard).toHaveAttribute('aria-pressed', 'false')
    expect(parqueCard).toHaveAttribute('aria-pressed', 'true')
  })

  it('should display correct step progress', () => {
    renderWithProvider(<Step4Page />)

    expect(screen.getByText('Paso 4 de 8')).toBeInTheDocument()
  })
})
