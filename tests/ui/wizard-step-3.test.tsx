import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
      'Ej: Superman, dinosaurios, Harry Potter, fútbol, la Oveja Dolly…'
    )
  })

  it('should render the description', () => {
    render(<Step3Page />)

    expect(
      screen.getByText('Escribe personajes, hobbies o universos que le hagan ilusión. Cuanto más concreto, mejor.')
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

  it('should render all suggested chips', () => {
    render(<Step3Page />)

    expect(screen.getByRole('button', { name: 'Superhéroes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Piratas' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dinosaurios' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Princesas' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Misterio' })).toBeInTheDocument()
  })

  it('should add chip text to textarea when clicked', async () => {
    const user = userEvent.setup()
    render(<Step3Page />)

    const textarea = screen.getByRole('textbox')
    const piratasButton = screen.getByRole('button', { name: 'Piratas' })

    // Initially empty
    expect(textarea).toHaveValue('')

    // Click chip
    await user.click(piratasButton)

    // Text added
    expect(textarea).toHaveValue('Piratas')
  })

  it('should append chip with comma when textarea has content', async () => {
    const user = userEvent.setup()
    render(<Step3Page />)

    const textarea = screen.getByRole('textbox')
    const superheroesButton = screen.getByRole('button', { name: 'Superhéroes' })
    const piratasButton = screen.getByRole('button', { name: 'Piratas' })

    // Click first chip
    await user.click(superheroesButton)
    expect(textarea).toHaveValue('Superhéroes')

    // Click second chip
    await user.click(piratasButton)
    expect(textarea).toHaveValue('Superhéroes, Piratas')
  })

  it('should not duplicate chip when clicked twice', async () => {
    const user = userEvent.setup()
    render(<Step3Page />)

    const textarea = screen.getByRole('textbox')
    const piratasButton = screen.getByRole('button', { name: 'Piratas' })

    // Click chip twice
    await user.click(piratasButton)
    await user.click(piratasButton)

    // Should only appear once
    expect(textarea).toHaveValue('Piratas')
  })
})
