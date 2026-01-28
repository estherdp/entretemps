import { describe, it, expect, vi } from 'vitest'
import { listMyAdventurePacks } from '@/application/list-my-adventure-packs'
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

describe('listMyAdventurePacks', () => {
  it('should call repository listByUserId and return packs', async () => {
    const mockPacks: SavedAdventurePack[] = [
      {
        id: 'saved-1',
        userId: 'user-123',
        title: 'Pack 1',
        pack: mockPack,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'saved-2',
        userId: 'user-123',
        title: 'Pack 2',
        pack: mockPack,
        createdAt: '2024-01-02T00:00:00Z',
      },
    ]

    const mockRepository = {
      listByUserId: vi.fn().mockResolvedValue(mockPacks),
    } as unknown as AdventurePackRepository

    const result = await listMyAdventurePacks('user-123', mockRepository)

    expect(mockRepository.listByUserId).toHaveBeenCalledWith('user-123')
    expect(result).toEqual(mockPacks)
    expect(result).toHaveLength(2)
  })

  it('should return empty array when user has no packs', async () => {
    const mockRepository = {
      listByUserId: vi.fn().mockResolvedValue([]),
    } as unknown as AdventurePackRepository

    const result = await listMyAdventurePacks('user-123', mockRepository)

    expect(result).toEqual([])
  })

  it('should propagate repository errors', async () => {
    const mockRepository = {
      listByUserId: vi.fn().mockRejectedValue(new Error('Database error')),
    } as unknown as AdventurePackRepository

    await expect(
      listMyAdventurePacks('user-123', mockRepository)
    ).rejects.toThrow('Database error')
  })
})
