import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Step5Page from '@/app/wizard/step-5/page'
import { WizardProvider } from '@/ui/wizard/wizard-provider'

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<WizardProvider>{ui}</WizardProvider>)
}

describe('Step5Page', () => {
  it('should render the step title', () => {
    renderWithProvider(<Step5Page />)

    expect(screen.getByText('Tipo de aventura')).toBeInTheDocument()
  })

  it('should mark "Misterio" card as selected when clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Step5Page />)

    const misterioCard = screen.getByRole('button', { name: /misterio/i })

    // Initially not selected
    expect(misterioCard).toHaveAttribute('aria-pressed', 'false')

    // Click to select
    await user.click(misterioCard)

    // Now selected
    expect(misterioCard).toHaveAttribute('aria-pressed', 'true')
  })
})