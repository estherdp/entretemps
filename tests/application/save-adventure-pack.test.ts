import { describe, it, expect, vi } from 'vitest'
import { saveAdventurePack } from '@/application/save-adventure-pack'
import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
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

describe('saveAdventurePack', () => {
  it('should call repository save with correct parameters', async () => {
    const mockRepository = {
      save: vi.fn().mockResolvedValue({
        id: 'saved-123',
        userId: 'user-123',
        title: 'Test Adventure',
        pack: mockPack,
        createdAt: '2024-01-01T00:00:00Z',
      }),
    } as unknown as AdventurePackRepository

    const result = await saveAdventurePack(
      {
        userId: 'user-123',
        pack: mockPack,
      },
      mockRepository
    )

    expect(mockRepository.save).toHaveBeenCalledWith({
      userId: 'user-123',
      title: 'Test Adventure',
      pack: mockPack,
    })
    expect(result.id).toBe('saved-123')
    expect(result.userId).toBe('user-123')
    expect(result.title).toBe('Test Adventure')
  })

  it('should propagate repository errors', async () => {
    const mockRepository = {
      save: vi.fn().mockRejectedValue(new Error('Database error')),
    } as unknown as AdventurePackRepository

    await expect(
      saveAdventurePack(
        {
          userId: 'user-123',
          pack: mockPack,
        },
        mockRepository
      )
    ).rejects.toThrow('Database error')
  })
})
