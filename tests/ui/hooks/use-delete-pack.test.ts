// tests/ui/hooks/use-delete-pack.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useDeletePack } from '@/ui/hooks/use-delete-pack'
import type { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import type { AuthService } from '@/domain/services/auth.interface'

// Mock del provider
const mockAuthService: AuthService = {
  getCurrentUser: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
}

const mockRepository: Partial<AdventurePackRepository> = {
  deleteById: vi.fn(),
}

// Mock del hook useRepositories
vi.mock('@/ui/providers/repository-provider', () => ({
  useRepositories: () => ({
    authService: mockAuthService,
    adventurePackRepository: mockRepository,
  }),
}))

// Mock del caso de uso
vi.mock('@/application/delete-my-adventure-pack', () => ({
  deleteMyAdventurePack: vi.fn(),
}))

import { deleteMyAdventurePack } from '@/application/delete-my-adventure-pack'

describe('useDeletePack', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Success cases', () => {
    it('should delete pack successfully when user is authenticated', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(mockUser)
      ;(deleteMyAdventurePack as any).mockResolvedValue({ ok: true })

      const { result } = renderHook(() => useDeletePack())

      expect(result.current.isDeleting).toBe(false)
      expect(result.current.error).toBe(null)

      let success: boolean = false
      await act(async () => {
        success = await result.current.deletePack('pack-123')
      })

      expect(success).toBe(true)
      expect(result.current.isDeleting).toBe(false)
      expect(result.current.error).toBe(null)
      expect(deleteMyAdventurePack).toHaveBeenCalledWith(
        { packId: 'pack-123', userId: 'user-123' },
        mockRepository
      )
    })

    it('should return true on successful deletion', async () => {
      const mockUser = { id: 'user-456', email: 'test@example.com' }

      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(mockUser)
      ;(deleteMyAdventurePack as any).mockResolvedValue({ ok: true })

      const { result } = renderHook(() => useDeletePack())
      let success: boolean = false
      await act(async () => {
        success = await result.current.deletePack('pack-789')
      })

      expect(success).toBe(true)
    })

    it('should clear previous errors on new delete attempt', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      // Primera llamada con error
      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(mockUser)
      ;(deleteMyAdventurePack as any).mockResolvedValue({
        ok: false,
        error: 'Error temporal',
      })

      const { result } = renderHook(() => useDeletePack())
      await act(async () => {
        await result.current.deletePack('pack-123')
      })

      expect(result.current.error).toBe('Error temporal')

      // Segunda llamada exitosa
      ;(deleteMyAdventurePack as any).mockResolvedValue({ ok: true })
      await act(async () => {
        await result.current.deletePack('pack-456')
      })

      expect(result.current.error).toBe(null)
    })
  })

  describe('Authentication errors', () => {
    it('should return false and set error when user is not authenticated', async () => {
      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(null)

      const { result } = renderHook(() => useDeletePack())
      let success: boolean = true
      await act(async () => {
        success = await result.current.deletePack('pack-123')
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('Debes iniciar sesión para eliminar aventuras')
      expect(deleteMyAdventurePack).not.toHaveBeenCalled()
    })

    it('should handle authentication service errors', async () => {
      ;(mockAuthService.getCurrentUser as any).mockRejectedValue(
        new Error('Authentication service unavailable')
      )

      const { result } = renderHook(() => useDeletePack())
      let success: boolean = true
      await act(async () => {
        success = await result.current.deletePack('pack-123')
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('Authentication service unavailable')
    })
  })

  describe('Use case errors', () => {
    it('should return false when use case returns ok: false', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(mockUser)
      ;(deleteMyAdventurePack as any).mockResolvedValue({
        ok: false,
        error: 'Pack no encontrado',
      })

      const { result } = renderHook(() => useDeletePack())
      let success: boolean = true
      await act(async () => {
        success = await result.current.deletePack('pack-123')
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('Pack no encontrado')
    })

    it('should use default error message when use case returns ok: false without error', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(mockUser)
      ;(deleteMyAdventurePack as any).mockResolvedValue({ ok: false })

      const { result } = renderHook(() => useDeletePack())
      let success: boolean = true
      await act(async () => {
        success = await result.current.deletePack('pack-123')
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('Error al eliminar la aventura')
    })

    it('should propagate error message from use case', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(mockUser)
      ;(deleteMyAdventurePack as any).mockResolvedValue({
        ok: false,
        error: 'No tienes permisos para eliminar este pack',
      })

      const { result } = renderHook(() => useDeletePack())
      let success: boolean = true
      await act(async () => {
        success = await result.current.deletePack('pack-123')
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('No tienes permisos para eliminar este pack')
    })
  })

  describe('Loading states', () => {
    it('should set isDeleting to true during operation', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(mockUser)
      ;(deleteMyAdventurePack as any).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 50))
      )

      const { result } = renderHook(() => useDeletePack())

      expect(result.current.isDeleting).toBe(false)

      let deletePromise: Promise<boolean>
      act(() => {
        deletePromise = result.current.deletePack('pack-123')
      })

      await waitFor(() => {
        expect(result.current.isDeleting).toBe(true)
      })

      await act(async () => {
        await deletePromise
      })

      expect(result.current.isDeleting).toBe(false)
    })

    it('should reset isDeleting after completion', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(mockUser)
      ;(deleteMyAdventurePack as any).mockResolvedValue({ ok: true })

      const { result } = renderHook(() => useDeletePack())
      await act(async () => {
        await result.current.deletePack('pack-123')
      })

      expect(result.current.isDeleting).toBe(false)
    })

    it('should reset isDeleting even on error', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(mockUser)
      ;(deleteMyAdventurePack as any).mockResolvedValue({
        ok: false,
        error: 'Error',
      })

      const { result } = renderHook(() => useDeletePack())
      await act(async () => {
        await result.current.deletePack('pack-123')
      })

      expect(result.current.isDeleting).toBe(false)
    })
  })

  describe('Error handling', () => {
    it('should handle non-Error exceptions', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(mockUser)
      ;(deleteMyAdventurePack as any).mockRejectedValue('String error')

      const { result } = renderHook(() => useDeletePack())
      let success: boolean = true
      await act(async () => {
        success = await result.current.deletePack('pack-123')
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('Error desconocido')
    })

    it('should handle Error instances correctly', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }

      ;(mockAuthService.getCurrentUser as any).mockResolvedValue(mockUser)
      ;(deleteMyAdventurePack as any).mockRejectedValue(
        new Error('Database connection failed')
      )

      const { result } = renderHook(() => useDeletePack())
      let success: boolean = true
      await act(async () => {
        success = await result.current.deletePack('pack-123')
      })

      expect(success).toBe(false)
      expect(result.current.error).toBe('Database connection failed')
    })
  })
})
