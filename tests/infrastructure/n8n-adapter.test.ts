import { describe, it, expect, vi, beforeEach } from 'vitest'
import { N8NAdapter } from '@/infrastructure/n8n/n8n-adapter'
import type { WizardData } from '@/domain/wizard-data'
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

const mockGeneratedPack: GeneratedAdventurePack = {
  id: 'pack-123',
  title: 'La Aventura de los Dinosaurios',
  image: {
    url: 'https://example.com/image.jpg',
    prompt: 'Dinosaur adventure',
  },
  estimatedDurationMinutes: 60,
  ageRange: { min: 6, max: 10 },
  participants: 8,
  difficulty: 'easy',
  tone: 'funny',
  adventureType: 'mystery',
  place: 'home',
  materials: ['Papel', 'Lápices'],
  introduction: {
    story: 'Érase una vez...',
    setupForParents: 'Preparar el espacio...',
  },
  missions: [
    {
      order: 1,
      title: 'Misión 1',
      story: 'Historia de la misión',
      parentGuide: 'Guía para padres',
      successCondition: 'Encontrar la pista',
    },
    {
      order: 2,
      title: 'Misión 2',
      story: 'Historia 2',
      parentGuide: 'Guía 2',
      successCondition: 'Pista 2',
    },
    {
      order: 3,
      title: 'Misión 3',
      story: 'Historia 3',
      parentGuide: 'Guía 3',
      successCondition: 'Pista 3',
    },
  ],
  conclusion: {
    story: 'Final feliz',
    celebrationTip: 'Celebrad con una fiesta',
  },
  createdAt: '2024-01-15T10:30:00.000Z',
}

describe('N8NAdapter', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_N8N_WEBHOOK_URL', 'https://n8n.example.com/webhook')
    global.fetch = vi.fn()
  })

  it('should throw error if webhook URL is not configured', () => {
    vi.stubEnv('NEXT_PUBLIC_N8N_WEBHOOK_URL', '')

    expect(() => new N8NAdapter()).toThrow('N8N_WEBHOOK_URL no configurada.')
  })

  it('should send POST request to n8n webhook and return pack on success', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockGeneratedPack,
    })
    global.fetch = mockFetch

    const adapter = new N8NAdapter('https://n8n.example.com/webhook')
    const pack = await adapter.generateAdventure(mockWizardData, 'es', {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'https://n8n.example.com/webhook',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    )

    expect(pack).toEqual(mockGeneratedPack)
  })

  it('should throw error on non-ok response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })
    global.fetch = mockFetch

    const adapter = new N8NAdapter('https://n8n.example.com/webhook')

    await expect(
      adapter.generateAdventure(mockWizardData, 'es', {
        phases: 3,
        puzzlesPerPhase: 2,
        screenFree: true,
      })
    ).rejects.toThrow('Error del servidor N8N: 500')
  })

  it('should throw error on network failure', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    global.fetch = mockFetch

    const adapter = new N8NAdapter('https://n8n.example.com/webhook')

    await expect(
      adapter.generateAdventure(mockWizardData, 'es', {
        phases: 3,
        puzzlesPerPhase: 2,
        screenFree: true,
      })
    ).rejects.toThrow('Error de conexión con N8N')
  })
})
