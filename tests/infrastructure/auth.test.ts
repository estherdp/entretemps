import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signInWithEmail, getCurrentUser, signOut, onAuthStateChange } from '@/infrastructure/supabase/auth'
import * as supabaseClient from '@/infrastructure/supabase/supabase-client'

vi.mock('@/infrastructure/supabase/supabase-client', () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      getUser: vi.fn(),
      getSession: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}))

describe('Auth Helper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signInWithEmail', () => {
    it('should call signInWithOtp with correct parameters', async () => {
      const mockSignInWithOtp = vi.spyOn(supabaseClient.supabase.auth, 'signInWithOtp')
      mockSignInWithOtp.mockResolvedValue({ data: {}, error: null } as never)

      await signInWithEmail('test@example.com')

      expect(mockSignInWithOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        options: {
          emailRedirectTo: expect.stringContaining('/'),
        },
      })
    })

    it('should throw error when signInWithOtp fails', async () => {
      const mockSignInWithOtp = vi.spyOn(supabaseClient.supabase.auth, 'signInWithOtp')
      mockSignInWithOtp.mockResolvedValue({
        data: {},
        error: { message: 'Invalid email' },
      } as never)

      await expect(signInWithEmail('invalid')).rejects.toThrow('El email introducido no es válido.')
    })

    it('should throw rate limit error with friendly message', async () => {
      const mockSignInWithOtp = vi.spyOn(supabaseClient.supabase.auth, 'signInWithOtp')
      mockSignInWithOtp.mockResolvedValue({
        data: {},
        error: { message: 'email rate limit exceeded' },
      } as never)

      await expect(signInWithEmail('test@example.com')).rejects.toThrow(
        'Has solicitado demasiados enlaces. Por favor, espera unos minutos e inténtalo de nuevo.'
      )
    })

    it('should throw generic error for unknown errors', async () => {
      const mockSignInWithOtp = vi.spyOn(supabaseClient.supabase.auth, 'signInWithOtp')
      mockSignInWithOtp.mockResolvedValue({
        data: {},
        error: { message: 'Unknown error' },
      } as never)

      await expect(signInWithEmail('test@example.com')).rejects.toThrow('Error al enviar el enlace: Unknown error')
    })
  })

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      const mockGetSession = vi.spyOn(supabaseClient.supabase.auth, 'getSession')
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
            },
          },
        },
      } as never)

      const user = await getCurrentUser()

      expect(user).toEqual({
        id: 'user-123',
        email: 'test@example.com',
      })
    })

    it('should return null when not authenticated', async () => {
      const mockGetSession = vi.spyOn(supabaseClient.supabase.auth, 'getSession')
      mockGetSession.mockResolvedValue({
        data: { session: null },
      } as never)

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })
  })

  describe('signOut', () => {
    it('should call signOut successfully', async () => {
      const mockSignOut = vi.spyOn(supabaseClient.supabase.auth, 'signOut')
      mockSignOut.mockResolvedValue({ error: null } as never)

      await signOut()

      expect(mockSignOut).toHaveBeenCalled()
    })

    it('should throw error when signOut fails', async () => {
      const mockSignOut = vi.spyOn(supabaseClient.supabase.auth, 'signOut')
      mockSignOut.mockResolvedValue({
        error: { message: 'Sign out failed' },
      } as never)

      await expect(signOut()).rejects.toThrow('Error al cerrar sesión')
    })
  })

  describe('onAuthStateChange', () => {
    it('should call callback with user on auth change', () => {
      const mockCallback = vi.fn()
      const mockUnsubscribe = vi.fn()
      const mockOnAuthStateChange = vi.spyOn(supabaseClient.supabase.auth, 'onAuthStateChange')

      mockOnAuthStateChange.mockImplementation((callback) => {
        // Simulate auth state change
        callback('SIGNED_IN', {
          user: {
            id: 'user-123',
            email: 'test@example.com',
          },
        } as never)

        return {
          data: { subscription: { unsubscribe: mockUnsubscribe } },
        } as never
      })

      const unsubscribe = onAuthStateChange(mockCallback)

      expect(mockCallback).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'test@example.com',
      })

      unsubscribe()
      expect(mockUnsubscribe).toHaveBeenCalled()
    })

    it('should call callback with null when user signs out', () => {
      const mockCallback = vi.fn()
      const mockUnsubscribe = vi.fn()
      const mockOnAuthStateChange = vi.spyOn(supabaseClient.supabase.auth, 'onAuthStateChange')

      mockOnAuthStateChange.mockImplementation((callback) => {
        // Simulate sign out
        callback('SIGNED_OUT', null as never)

        return {
          data: { subscription: { unsubscribe: mockUnsubscribe } },
        } as never
      })

      onAuthStateChange(mockCallback)

      expect(mockCallback).toHaveBeenCalledWith(null)
    })
  })
})
