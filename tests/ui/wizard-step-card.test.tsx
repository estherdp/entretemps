import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WizardStepCard } from '@/ui/components/wizard-step-card'

describe('WizardStepCard', () => {
  it('should render title', () => {
    render(
      <WizardStepCard title="Test Title">
        <p>Content</p>
      </WizardStepCard>
    )

    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should render description when provided', () => {
    render(
      <WizardStepCard title="Title" description="Test description">
        <p>Content</p>
      </WizardStepCard>
    )

    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('should render children content', () => {
    render(
      <WizardStepCard title="Title">
        <button>Click me</button>
      </WizardStepCard>
    )

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('should not render description when not provided', () => {
    const { container } = render(
      <WizardStepCard title="Title">
        <p>Content</p>
      </WizardStepCard>
    )

    const cardDescription = container.querySelector('[class*="CardDescription"]')
    expect(cardDescription).toBeNull()
  })
})
