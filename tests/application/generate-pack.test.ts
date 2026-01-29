import { describe, it, expect, vi } from 'vitest'
import { generatePack } from '@/application/generate-pack'
import type { WizardData } from '@/domain/wizard-data'
import type { IAdventureProvider } from '@/domain/services'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

const mockWizardData: WizardData = {
  occasion: 'birthday',
  ages: { min: 6, max: 10 },
  kidsCount: 8,
  interests: 'Dinosaurios',
  place: 'home',
  adventureType: 'mystery',
  tone: 'funny',
  difficulty: 'easy',
}

const mockPack: GeneratedAdventurePack = {
  id: 'pack-123',
  title: 'Test Pack',
  image: { url: 'https://example.com/image.jpg', prompt: 'test prompt' },
  estimatedDurationMinutes: 60,
  ageRange: { min: 6, max: 10 },
  participants: 8,
  difficulty: 'easy',
  tone: 'funny',
  adventureType: 'mystery',
  place: 'home',
  materials: [],
  introduction: { story: 'intro story', setupForParents: 'setup guide' },
  missions: [
    {
      order: 1,
      title: 'Mission 1',
      story: 'story 1',
      parentGuide: 'guide 1',
      successCondition: 'success 1',
    },
    {
      order: 2,
      title: 'Mission 2',
      story: 'story 2',
      parentGuide: 'guide 2',
      successCondition: 'success 2',
    },
    {
      order: 3,
      title: 'Mission 3',
      story: 'story 3',
      parentGuide: 'guide 3',
      successCondition: 'success 3',
    },
  ],
  conclusion: { story: 'conclusion story', celebrationTip: 'celebration tip' },
  createdAt: '2024-01-15T10:30:00.000Z',
}

describe('generatePack', () => {
  it('should call provider.generateAdventure with correct parameters', async () => {
    const mockProvider: IAdventureProvider = {
      generateAdventure: vi.fn().mockResolvedValue(mockPack),
    }

    await generatePack(mockWizardData, mockProvider)

    expect(mockProvider.generateAdventure).toHaveBeenCalledWith(mockWizardData, 'es', {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    })
  })

  it('should return success result when provider succeeds', async () => {
    const mockProvider: IAdventureProvider = {
      generateAdventure: vi.fn().mockResolvedValue(mockPack),
    }

    const result = await generatePack(mockWizardData, mockProvider)

    expect(result.ok).toBe(true)
    expect(result.pack).toEqual(mockPack)
    expect(result.error).toBeUndefined()
  })

  it('should return error result when provider fails', async () => {
    const mockProvider: IAdventureProvider = {
      generateAdventure: vi.fn().mockRejectedValue(new Error('Connection error')),
    }

    const result = await generatePack(mockWizardData, mockProvider)

    expect(result.ok).toBe(false)
    expect(result.error).toBe('Connection error')
    expect(result.pack).toBeUndefined()
  })
})
