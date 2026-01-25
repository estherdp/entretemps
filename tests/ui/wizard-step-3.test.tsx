import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Step3Page from '@/app/wizard/step-3/page'

describe('Step3Page', () => {
  it('should render the step title', () => {
    render(<Step3Page />)

    expect(screen.getByText('¿Qué le encanta al/la protagonista?')).toBeInTheDocument()
  })

  it('should render the textarea with placeholder', () => {
    render(<Step3Page />)

    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute(
      'placeholder',
      'Superman, dinosaurios, Harry Potter, fútbol, la Oveja Dolly…'
    )
  })

  it('should render the description', () => {
    render(<Step3Page />)

    expect(
      screen.getByText('Escribe personajes, hobbies o universos que le apasionen.')
    ).toBeInTheDocument()
  })

  it('should render the label for the textarea', () => {
    render(<Step3Page />)

    expect(screen.getByText('Intereses del protagonista')).toBeInTheDocument()
  })

  it('should display correct step progress', () => {
    render(<Step3Page />)

    expect(screen.getByText('Paso 3 de 5')).toBeInTheDocument()
  })
})
