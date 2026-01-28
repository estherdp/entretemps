import { describe, it, expect, vi } from 'vitest'
import { getAdventurePackById } from '@/application/get-adventure-pack-by-id'
import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'
import { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

const mockPack: GeneratedAdventurePack = {
  id: 'pack-123',
  title: 'Test Adventure',
  image: { url: 'https://example.com/image.jpg', prompt: 'test' },
  estimatedDurationMinutes: 60,
  ageRange: { min: 5, max: 10 },
  participants: 4,
  difficulty: 'easy',
  tone: 'funny',
  adventureType: 'mystery',
  place: 'home',
  materials: ['paper', 'pencil'],
  introduction: {
    story: 'Test story',
    setupForParents: 'Setup guide',
  },
  missions: [
    {
      order: 1,
      title: 'Mission 1',
      story: 'Mission story',
      parentGuide: 'Parent guide',
      successCondition: 'Success condition',
    },
  ],
  conclusion: {
    story: 'Conclusion story',
    celebrationTip: 'Celebration tip',
  },
  createdAt: '2024-01-01T00:00:00Z',
}

describe('getAdventurePackById', () => {
  it('should call repository getById and return pack', async () => {
    const mockSavedPack: SavedAdventurePack = {
      id: 'saved-123',
      userId: 'user-123',
      title: 'Test Adventure',
      pack: mockPack,
      createdAt: '2024-01-01T00:00:00Z',
    }

    const mockRepository = {
      getById: vi.fn().mockResolvedValue(mockSavedPack),
    } as unknown as AdventurePackRepository

    const result = await getAdventurePackById('saved-123', mockRepository)

    expect(mockRepository.getById).toHaveBeenCalledWith('saved-123')
    expect(result).toEqual(mockSavedPack)
  })

  it('should return null when pack not found', async () => {
    const mockRepository = {
      getById: vi.fn().mockResolvedValue(null),
    } as unknown as AdventurePackRepository

    const result = await getAdventurePackById('nonexistent', mockRepository)

    expect(result).toBeNull()
  })

  it('should propagate repository errors', async () => {
    const mockRepository = {
      getById: vi.fn().mockRejectedValue(new Error('Database error')),
    } as unknown as AdventurePackRepository

    await expect(
      getAdventurePackById('saved-123', mockRepository)
    ).rejects.toThrow('Database error')
  })
})
