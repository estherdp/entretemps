import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Step5Page from '@/app/wizard/step-5/page'

describe('Step5Page', () => {
  it('should render the step title', () => {
    render(<Step5Page />)

    expect(screen.getByText('Demos forma a la història')).toBeInTheDocument()
  })

  it('should mark "Misteri" card as selected when clicked', async () => {
    const user = userEvent.setup()
    render(<Step5Page />)

    const misteriCard = screen.getByRole('button', { name: /misteri/i })

    // Initially not selected
    expect(misteriCard).toHaveAttribute('aria-pressed', 'false')

    // Click to select
    await user.click(misteriCard)

    // Now selected
    expect(misteriCard).toHaveAttribute('aria-pressed', 'true')
  })
})
