// tests/application/delete-my-adventure-pack.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteMyAdventurePack } from '@/application/delete-my-adventure-pack'
import type { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'

describe('deleteMyAdventurePack', () => {
  let mockRepository: AdventurePackRepository

  beforeEach(() => {
    mockRepository = {
      deleteById: vi.fn(),
    } as any
  })

  describe('Success cases', () => {
    it('should delete pack successfully when user owns it', async () => {
      const request = {
        packId: 'pack-123',
        userId: 'user-456',
      }

      ;(mockRepository.deleteById as any).mockResolvedValue(true)

      const result = await deleteMyAdventurePack(request, mockRepository)

      expect(result.ok).toBe(true)
      expect(result.error).toBeUndefined()
      expect(mockRepository.deleteById).toHaveBeenCalledWith('pack-123', 'user-456')
      expect(mockRepository.deleteById).toHaveBeenCalledTimes(1)
    })
  })

  describe('Validation errors', () => {
    it('should return error when packId is empty', async () => {
      const request = {
        packId: '',
        userId: 'user-456',
      }

      const result = await deleteMyAdventurePack(request, mockRepository)

      expect(result.ok).toBe(false)
      expect(result.error).toBe('El ID del pack es requerido')
      expect(mockRepository.deleteById).not.toHaveBeenCalled()
    })

    it('should return error when packId is only whitespace', async () => {
      const request = {
        packId: '   ',
        userId: 'user-456',
      }

      const result = await deleteMyAdventurePack(request, mockRepository)

      expect(result.ok).toBe(false)
      expect(result.error).toBe('El ID del pack es requerido')
      expect(mockRepository.deleteById).not.toHaveBeenCalled()
    })

    it('should return error when userId is empty', async () => {
      const request = {
        packId: 'pack-123',
        userId: '',
      }

      const result = await deleteMyAdventurePack(request, mockRepository)

      expect(result.ok).toBe(false)
      expect(result.error).toBe('El ID del usuario es requerido')
      expect(mockRepository.deleteById).not.toHaveBeenCalled()
    })

    it('should return error when userId is only whitespace', async () => {
      const request = {
        packId: 'pack-123',
        userId: '   ',
      }

      const result = await deleteMyAdventurePack(request, mockRepository)

      expect(result.ok).toBe(false)
      expect(result.error).toBe('El ID del usuario es requerido')
      expect(mockRepository.deleteById).not.toHaveBeenCalled()
    })
  })

  describe('Repository errors', () => {
    it('should return error when pack is not found', async () => {
      const request = {
        packId: 'non-existent-pack',
        userId: 'user-456',
      }

      ;(mockRepository.deleteById as any).mockRejectedValue(
        new Error('Pack no encontrado')
      )

      const result = await deleteMyAdventurePack(request, mockRepository)

      expect(result.ok).toBe(false)
      expect(result.error).toBe('Pack no encontrado')
    })

    it('should return error when user does not own the pack', async () => {
      const request = {
        packId: 'pack-123',
        userId: 'wrong-user',
      }

      ;(mockRepository.deleteById as any).mockRejectedValue(
        new Error('No tienes permisos para eliminar este pack')
      )

      const result = await deleteMyAdventurePack(request, mockRepository)

      expect(result.ok).toBe(false)
      expect(result.error).toBe('No tienes permisos para eliminar este pack')
    })

    it('should return error when database fails', async () => {
      const request = {
        packId: 'pack-123',
        userId: 'user-456',
      }

      ;(mockRepository.deleteById as any).mockRejectedValue(
        new Error('Error al eliminar el pack: Database connection failed')
      )

      const result = await deleteMyAdventurePack(request, mockRepository)

      expect(result.ok).toBe(false)
      expect(result.error).toContain('Database connection failed')
    })

    it('should handle non-Error exceptions', async () => {
      const request = {
        packId: 'pack-123',
        userId: 'user-456',
      }

      ;(mockRepository.deleteById as any).mockRejectedValue('String error')

      const result = await deleteMyAdventurePack(request, mockRepository)

      expect(result.ok).toBe(false)
      expect(result.error).toBe('Error desconocido')
    })
  })

  describe('Security', () => {
    it('should call repository with both packId and userId for security', async () => {
      const request = {
        packId: 'pack-123',
        userId: 'user-456',
      }

      ;(mockRepository.deleteById as any).mockResolvedValue(true)

      await deleteMyAdventurePack(request, mockRepository)

      // Verificar que se pasan ambos parámetros (doble check de seguridad)
      expect(mockRepository.deleteById).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String)
      )

      const call = (mockRepository.deleteById as any).mock.calls[0]
      expect(call[0]).toBe('pack-123')
      expect(call[1]).toBe('user-456')
    })
  })
})
