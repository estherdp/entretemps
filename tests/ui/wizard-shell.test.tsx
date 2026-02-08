import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WizardShell } from '@/ui/components/wizard-shell'

describe('WizardShell', () => {
  it('should render children content', () => {
    render(
      <WizardShell currentStep={1} totalSteps={5}>
        <p>Test content</p>
      </WizardShell>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should display correct step progress', () => {
    render(
      <WizardShell currentStep={3} totalSteps={5}>
        <p>Content</p>
      </WizardShell>
    )

    expect(screen.getByText('Paso 3 de 5')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('should show back button when prevHref is provided', () => {
    render(
      <WizardShell
        currentStep={2}
        totalSteps={5}
        prevHref="/wizard/step-1"
        nextHref="/wizard/step-3"
      >
        <p>Content</p>
      </WizardShell>
    )

    // Desktop + mobile sticky footer = 2 buttons each
    expect(screen.getAllByText('Atrás').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Siguiente').length).toBeGreaterThanOrEqual(1)
  })

  it('should use custom next label', () => {
    render(
      <WizardShell
        currentStep={5}
        totalSteps={5}
        nextLabel="Generar aventura"
      >
        <p>Content</p>
      </WizardShell>
    )

    // Desktop + mobile sticky footer = 2 buttons
    expect(screen.getAllByText('Generar aventura').length).toBeGreaterThanOrEqual(1)
  })

  it('should have clean white background', () => {
    const { container } = render(
      <WizardShell currentStep={1} totalSteps={5}>
        <p>Content</p>
      </WizardShell>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('bg-white')
  })

  it('should render mobile sticky footer', () => {
    render(
      <WizardShell currentStep={1} totalSteps={5} nextHref="/next">
        <p>Content</p>
      </WizardShell>
    )

    // Mobile footer should be present with fixed positioning
    const buttons = screen.getAllByText('Siguiente')
    expect(buttons.length).toBe(2) // Desktop + Mobile
  })
})
