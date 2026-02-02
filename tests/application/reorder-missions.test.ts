// tests/application/reorder-missions.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reorderMissions } from '@/application/reorder-missions'
import type { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import type { SavedAdventurePack } from '@/domain/saved-adventure-pack'
import type { GeneratedAdventurePack, GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'

describe('reorderMissions', () => {
  let mockPack: GeneratedAdventurePack
  let savedPack: SavedAdventurePack
  let mockRepository: AdventurePackRepository

  beforeEach(() => {
    mockPack = {
      id: 'pack-123',
      title: 'Test Adventure',
      image: { url: '', prompt: '' },
      estimatedDurationMinutes: 60,
      ageRange: { min: 6, max: 10 },
      participants: 5,
      difficulty: 'medium',
      tone: 'funny',
      adventureType: 'mystery',
      place: 'home',
      materials: [],
      introduction: {
        story: 'Intro',
        setupForParents: 'Setup',
      },
      missions: [
        {
          order: 1,
          title: 'Mission 1',
          story: 'Story 1',
          parentGuide: 'Guide 1',
          successCondition: 'Success 1',
        },
        {
          order: 2,
          title: 'Mission 2',
          story: 'Story 2',
          parentGuide: 'Guide 2',
          successCondition: 'Success 2',
        },
        {
          order: 3,
          title: 'Mission 3',
          story: 'Story 3',
          parentGuide: 'Guide 3',
          successCondition: 'Success 3',
        },
      ],
      conclusion: {
        story: 'Conclusion',
        celebrationTip: 'Celebrate',
      },
      createdAt: '2024-01-01T00:00:00Z',
    }

    savedPack = {
      id: 'saved-123',
      userId: 'user-456',
      title: 'Test Adventure',
      pack: mockPack,
      createdAt: '2024-01-01T00:00:00Z',
    }

    mockRepository = {
      getById: vi.fn().mockResolvedValue(savedPack),
      updatePackJson: vi.fn().mockImplementation((packId, updatedPack) => {
        return Promise.resolve({
          ...savedPack,
          pack: updatedPack,
        })
      }),
    } as unknown as AdventurePackRepository
  })

  it('should reorder missions successfully', async () => {
    // Nuevo orden: 3, 1, 2
    const newOrder = [3, 1, 2]

    const result = await reorderMissions(
      'saved-123',
      'user-456',
      newOrder,
      mockRepository
    )

    // Verificar que se guardó en el repositorio
    expect(mockRepository.updatePackJson).toHaveBeenCalledWith(
      'saved-123',
      expect.objectContaining({
        missions: [
          expect.objectContaining({
            order: 1, // Nuevo order
            title: 'Mission 3', // Era la misión 3
          }),
          expect.objectContaining({
            order: 2, // Nuevo order
            title: 'Mission 1', // Era la misión 1
          }),
          expect.objectContaining({
            order: 3, // Nuevo order
            title: 'Mission 2', // Era la misión 2
          }),
        ],
      })
    )

    // Verificar el resultado
    expect(result).toHaveLength(3)
    expect(result[0].title).toBe('Mission 3')
    expect(result[0].order).toBe(1)
    expect(result[1].title).toBe('Mission 1')
    expect(result[1].order).toBe(2)
    expect(result[2].title).toBe('Mission 2')
    expect(result[2].order).toBe(3)
  })

  it('should keep original order if newOrder is [1, 2, 3]', async () => {
    const newOrder = [1, 2, 3]

    const result = await reorderMissions(
      'saved-123',
      'user-456',
      newOrder,
      mockRepository
    )

    expect(result[0].title).toBe('Mission 1')
    expect(result[0].order).toBe(1)
    expect(result[1].title).toBe('Mission 2')
    expect(result[1].order).toBe(2)
    expect(result[2].title).toBe('Mission 3')
    expect(result[2].order).toBe(3)
  })

  it('should reverse order if newOrder is [3, 2, 1]', async () => {
    const newOrder = [3, 2, 1]

    const result = await reorderMissions(
      'saved-123',
      'user-456',
      newOrder,
      mockRepository
    )

    expect(result[0].title).toBe('Mission 3')
    expect(result[1].title).toBe('Mission 2')
    expect(result[2].title).toBe('Mission 1')
  })

  it('should throw error if pack not found', async () => {
    vi.mocked(mockRepository.getById).mockResolvedValue(null)

    await expect(
      reorderMissions('saved-123', 'user-456', [1, 2, 3], mockRepository)
    ).rejects.toThrow('Pack no encontrado')
  })

  it('should throw error if user does not own the pack', async () => {
    const packOwnedByOtherUser = {
      ...savedPack,
      userId: 'different-user',
    }

    vi.mocked(mockRepository.getById).mockResolvedValue(packOwnedByOtherUser)

    await expect(
      reorderMissions('saved-123', 'user-456', [1, 2, 3], mockRepository)
    ).rejects.toThrow('No tienes permiso para editar este pack')
  })

  it('should throw error if newOrder has wrong length', async () => {
    const newOrder = [1, 2] // Faltan misiones

    await expect(
      reorderMissions('saved-123', 'user-456', newOrder, mockRepository)
    ).rejects.toThrow('El nuevo orden debe contener todas las misiones')
  })

  it('should throw error if newOrder has invalid mission order', async () => {
    const newOrder = [1, 2, 99] // 99 no existe

    await expect(
      reorderMissions('saved-123', 'user-456', newOrder, mockRepository)
    ).rejects.toThrow('Orden inválido: la misión 99 no existe')
  })

  it('should throw error if newOrder has duplicates', async () => {
    const newOrder = [1, 1, 2] // 1 está duplicado

    await expect(
      reorderMissions('saved-123', 'user-456', newOrder, mockRepository)
    ).rejects.toThrow('El nuevo orden contiene misiones duplicadas')
  })

  it('should preserve all mission fields during reorder', async () => {
    const newOrder = [2, 3, 1]

    const result = await reorderMissions(
      'saved-123',
      'user-456',
      newOrder,
      mockRepository
    )

    // Verificar que todos los campos se preservan
    expect(result[0]).toMatchObject({
      order: 1,
      title: 'Mission 2',
      story: 'Story 2',
      parentGuide: 'Guide 2',
      successCondition: 'Success 2',
    })

    expect(result[1]).toMatchObject({
      order: 2,
      title: 'Mission 3',
      story: 'Story 3',
      parentGuide: 'Guide 3',
      successCondition: 'Success 3',
    })

    expect(result[2]).toMatchObject({
      order: 3,
      title: 'Mission 1',
      story: 'Story 1',
      parentGuide: 'Guide 1',
      successCondition: 'Success 1',
    })
  })
})
