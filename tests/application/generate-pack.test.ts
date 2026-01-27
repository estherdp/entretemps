import { describe, it, expect, vi } from 'vitest'
import { generatePack } from '@/application/generate-pack'
import type { WizardData } from '@/domain/wizard-data'
import * as n8nAdapter from '@/infrastructure/n8n/n8n-adapter'

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

describe('generatePack', () => {
  it('should call sendToN8N with correct request structure', async () => {
    const mockSendToN8N = vi.spyOn(n8nAdapter, 'sendToN8N').mockResolvedValue({
      ok: true,
      pack: {
        id: 'pack-123',
        title: 'Test Pack',
        image: { url: '', prompt: '' },
        estimatedDurationMinutes: 60,
        ageRange: { min: 6, max: 10 },
        participants: 8,
        difficulty: 'easy',
        tone: 'funny',
        adventureType: 'mystery',
        place: 'home',
        materials: [],
        introduction: { story: '', setupForParents: '' },
        missions: [],
        conclusion: { story: '', celebrationTip: '' },
        createdAt: '2024-01-15T10:30:00.000Z',
      },
    })

    await generatePack(mockWizardData)

    expect(mockSendToN8N).toHaveBeenCalledWith({
      locale: 'es',
      wizardData: mockWizardData,
      constraints: {
        phases: 3,
        puzzlesPerPhase: 2,
        screenFree: true,
      },
    })
  })

  it('should return success result when n8n adapter succeeds', async () => {
    const mockPack = {
      id: 'pack-123',
      title: 'Test Pack',
      image: { url: '', prompt: '' },
      estimatedDurationMinutes: 60,
      ageRange: { min: 6, max: 10 },
      participants: 8,
      difficulty: 'easy' as const,
      tone: 'funny' as const,
      adventureType: 'mystery' as const,
      place: 'home' as const,
      materials: [],
      introduction: { story: '', setupForParents: '' },
      missions: [],
      conclusion: { story: '', celebrationTip: '' },
      createdAt: '2024-01-15T10:30:00.000Z',
    }

    vi.spyOn(n8nAdapter, 'sendToN8N').mockResolvedValue({
      ok: true,
      pack: mockPack,
    })

    const result = await generatePack(mockWizardData)

    expect(result.ok).toBe(true)
    expect(result.pack).toEqual(mockPack)
  })

  it('should return error result when n8n adapter fails', async () => {
    vi.spyOn(n8nAdapter, 'sendToN8N').mockResolvedValue({
      ok: false,
      error: 'Connection error',
    })

    const result = await generatePack(mockWizardData)

    expect(result.ok).toBe(false)
    expect(result.error).toBe('Connection error')
  })
})
