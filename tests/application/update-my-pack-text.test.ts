import { describe, it, expect, vi } from 'vitest'
import { updateMyPackText, PackTextChanges } from '@/application/update-my-pack-text'
import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'
import { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

describe('updateMyPackText', () => {
  it('should update text fields in pack and call repository', async () => {
    const mockPack: GeneratedAdventurePack = {
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
      materials: ['Papel', 'Lápiz'],
      introduction: {
        story: 'Original intro story',
        setupForParents: 'Original setup',
      },
      missions: [
        {
          order: 1,
          title: 'Mission 1',
          story: 'Original mission 1 story',
          parentGuide: 'Guide 1',
          successCondition: 'Complete task 1',
        },
        {
          order: 2,
          title: 'Mission 2',
          story: 'Original mission 2 story',
          parentGuide: 'Guide 2',
          successCondition: 'Complete task 2',
        },
      ],
      conclusion: {
        story: 'Original conclusion story',
        celebrationTip: 'Celebrate!',
      },
      createdAt: '2024-01-01T00:00:00Z',
    }

    const savedPack: SavedAdventurePack = {
      id: 'saved-123',
      userId: 'user-456',
      title: 'Test Adventure',
      pack: mockPack,
      createdAt: '2024-01-01T00:00:00Z',
    }

    const mockRepository = {
      getById: vi.fn().mockResolvedValue(savedPack),
      updatePackJson: vi.fn().mockResolvedValue({
        ...savedPack,
        pack: {
          ...mockPack,
          title: 'Updated Title',
          image: {
            ...mockPack.image,
            url: 'https://example.com/new-image.jpg',
          },
          introduction: {
            story: 'Updated intro story',
            setupForParents: 'Updated setup',
          },
          missions: [
            {
              ...mockPack.missions[0],
              story: 'Updated mission 1 story',
            },
            mockPack.missions[1],
          ],
          conclusion: {
            ...mockPack.conclusion,
            story: 'Updated conclusion story',
          },
        },
      }),
    } as unknown as AdventurePackRepository

    const changes: PackTextChanges = {
      title: 'Updated Title',
      imageUrl: 'https://example.com/new-image.jpg',
      introductionStory: 'Updated intro story',
      introductionSetupForParents: 'Updated setup',
      missionsStory: [{ order: 1, story: 'Updated mission 1 story' }],
      conclusionStory: 'Updated conclusion story',
    }

    const result = await updateMyPackText('saved-123', 'user-456', changes, mockRepository)

    expect(mockRepository.getById).toHaveBeenCalledWith('saved-123')
    expect(mockRepository.updatePackJson).toHaveBeenCalledWith('saved-123', expect.objectContaining({
      title: 'Updated Title',
      image: expect.objectContaining({
        url: 'https://example.com/new-image.jpg',
      }),
      introduction: expect.objectContaining({
        story: 'Updated intro story',
        setupForParents: 'Updated setup',
      }),
      missions: expect.arrayContaining([
        expect.objectContaining({
          order: 1,
          story: 'Updated mission 1 story',
        }),
      ]),
      conclusion: expect.objectContaining({
        story: 'Updated conclusion story',
      }),
    }))
    expect(result.pack.title).toBe('Updated Title')
    expect(result.pack.image.url).toBe('https://example.com/new-image.jpg')
    expect(result.pack.introduction.story).toBe('Updated intro story')
    expect(result.pack.missions[0].story).toBe('Updated mission 1 story')
    expect(result.pack.conclusion.story).toBe('Updated conclusion story')
  })

  it('should throw error if pack not found', async () => {
    const mockRepository = {
      getById: vi.fn().mockResolvedValue(null),
    } as unknown as AdventurePackRepository

    await expect(
      updateMyPackText('saved-123', 'user-456', {}, mockRepository)
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
      updateMyPackText('saved-123', 'user-456', {}, mockRepository)
    ).rejects.toThrow('No tienes permiso para editar este pack')
  })
})
