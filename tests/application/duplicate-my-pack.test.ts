import { describe, it, expect, vi, beforeEach } from 'vitest'
import { duplicateMyPack } from '@/application/duplicate-my-pack'
import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'
import { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

describe('duplicateMyPack', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a new pack with insert and return new id', async () => {
    const mockPack: GeneratedAdventurePack = {
      id: 'pack-123',
      title: 'Original Adventure',
      image: { url: '', prompt: '' },
      estimatedDurationMinutes: 60,
      ageRange: { min: 6, max: 10 },
      participants: 5,
      difficulty: 'medium',
      tone: 'funny',
      adventureType: 'mystery',
      place: 'home',
      materials: ['Papel', 'Lápiz'],
      introduction: {
        story: 'Intro story',
        setupForParents: 'Setup',
      },
      missions: [
        {
          order: 1,
          title: 'Mission 1',
          story: 'Mission story',
          parentGuide: 'Guide',
          successCondition: 'Complete',
        },
      ],
      conclusion: {
        story: 'Conclusion',
        celebrationTip: 'Celebrate!',
      },
      createdAt: '2024-01-01T00:00:00Z',
    }

    const savedPack: SavedAdventurePack = {
      id: 'saved-123',
      userId: 'user-456',
      title: 'Original Adventure',
      pack: mockPack,
      createdAt: '2024-01-01T00:00:00Z',
    }

    const newSavedPack: SavedAdventurePack = {
      id: 'saved-789',
      userId: 'user-456',
      title: 'Original Adventure (copia)',
      pack: {
        ...mockPack,
        title: 'Original Adventure (copia)',
      },
      createdAt: new Date().toISOString(),
    }

    const mockRepository = {
      getById: vi.fn().mockResolvedValue(savedPack),
      save: vi.fn().mockResolvedValue(newSavedPack),
    } as unknown as AdventurePackRepository

    const result = await duplicateMyPack('saved-123', 'user-456', mockRepository)

    expect(mockRepository.getById).toHaveBeenCalledWith('saved-123')
    expect(mockRepository.save).toHaveBeenCalledWith({
      userId: 'user-456',
      title: expect.stringContaining('(copia)'),
      pack: expect.objectContaining({
        title: expect.stringContaining('(copia)'),
      }),
    })
    expect(result.id).toBe('saved-789')
    expect(result.userId).toBe('user-456')
    expect(result.title).toContain('(copia)')
  })

  it('should throw error if pack not found', async () => {
    const mockRepository = {
      getById: vi.fn().mockResolvedValue(null),
    } as unknown as AdventurePackRepository

    await expect(
      duplicateMyPack('saved-123', 'user-456', mockRepository)
    ).rejects.toThrow('Pack no encontrado')
  })

  it('should throw error if user does not own the pack', async () => {
    const mockPack: SavedAdventurePack = {
      id: 'saved-123',
      userId: 'different-user',
      title: 'Test',
      pack: {} as GeneratedAdventurePack,
      createdAt: '2024-01-01T00:00:00Z',
    }

    const mockRepository = {
      getById: vi.fn().mockResolvedValue(mockPack),
    } as unknown as AdventurePackRepository

    await expect(
      duplicateMyPack('saved-123', 'user-456', mockRepository)
    ).rejects.toThrow('No tienes permiso para duplicar este pack')
  })
})
