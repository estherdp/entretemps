import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '@/app/login/page'
import * as auth from '@/infrastructure/supabase/auth'

vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')

vi.mock('@/infrastructure/supabase/auth', () => ({
  signInWithEmail: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(() => null),
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render email input and submit button', () => {
    render(<LoginPage />)

    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar enlace/i })).toBeInTheDocument()
  })

  it('should show loading state when submitting', async () => {
    const mockSignInWithEmail = vi.spyOn(auth, 'signInWithEmail')
    mockSignInWithEmail.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )

    render(<LoginPage />)

    const input = screen.getByPlaceholderText('tu@email.com')
    const button = screen.getByRole('button', { name: /enviar enlace/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/enviando.../i)).toBeInTheDocument()
    })
  })

  it('should show success message after sending magic link', async () => {
    const mockSignInWithEmail = vi.spyOn(auth, 'signInWithEmail')
    mockSignInWithEmail.mockResolvedValue()

    render(<LoginPage />)

    const input = screen.getByPlaceholderText('tu@email.com')
    const button = screen.getByRole('button', { name: /enviar enlace/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/revisa tu email/i)).toBeInTheDocument()
      expect(screen.getByText(/test@example.com/)).toBeInTheDocument()
    })
  })

  it('should handle error when sign in fails', async () => {
    const mockSignInWithEmail = vi.spyOn(auth, 'signInWithEmail')
    mockSignInWithEmail.mockRejectedValue(new Error('Invalid email'))

    render(<LoginPage />)

    const input = screen.getByPlaceholderText('tu@email.com')
    const button = screen.getByRole('button', { name: /enviar enlace/i })

    fireEvent.change(input, { target: { value: 'invalid@test.com' } })
    fireEvent.click(button)

    // Wait for the button to return to normal state (not loading)
    await waitFor(() => {
      expect(button).not.toHaveTextContent('Enviando...')
    })

    expect(mockSignInWithEmail).toHaveBeenCalled()
  })

  it('should call signInWithEmail with correct email', async () => {
    const mockSignInWithEmail = vi.spyOn(auth, 'signInWithEmail')
    mockSignInWithEmail.mockResolvedValue()

    render(<LoginPage />)

    const input = screen.getByPlaceholderText('tu@email.com')
    const button = screen.getByRole('button', { name: /enviar enlace/i })

    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockSignInWithEmail).toHaveBeenCalledWith('test@example.com')
    })
  })
})
