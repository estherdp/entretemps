import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendToN8N } from '@/infrastructure/n8n/n8n-adapter'
import type { GeneratePackRequest } from '@/application/dto/generate-pack-request'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

const mockRequest: GeneratePackRequest = {
  locale: 'es',
  wizardData: {
    occasion: 'birthday',
    ages: { min: 6, max: 10 },
    kidsCount: 8,
    interests: 'Dinosaurios',
    place: 'home',
    adventureType: 'mystery',
    tone: 'funny',
    difficulty: 'easy',
  },
  constraints: {
    phases: 3,
    puzzlesPerPhase: 2,
    screenFree: true,
  },
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
  ],
  conclusion: {
    story: 'Final feliz',
    celebrationTip: 'Celebrad con una fiesta',
  },
  createdAt: '2024-01-15T10:30:00.000Z',
}

describe('sendToN8N', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_N8N_WEBHOOK_URL', 'https://n8n.example.com/webhook')
    global.fetch = vi.fn()
  })

  it('should return error if webhook URL is not configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_N8N_WEBHOOK_URL', '')

    const result = await sendToN8N(mockRequest)

    expect(result.ok).toBe(false)
    expect(result.error).toBe('N8N_WEBHOOK_URL no configurada.')
  })

  it('should send POST request to n8n webhook and return pack on success', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockGeneratedPack,
    })
    global.fetch = mockFetch

    const result = await sendToN8N(mockRequest)

    expect(mockFetch).toHaveBeenCalledWith('https://n8n.example.com/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockRequest),
    })

    expect(result.ok).toBe(true)
    expect(result.pack).toEqual(mockGeneratedPack)
  })

  it('should return error on non-ok response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })
    global.fetch = mockFetch

    const result = await sendToN8N(mockRequest)

    expect(result.ok).toBe(false)
    expect(result.error).toBe('Error del servidor: 500')
  })

  it('should return error on network failure', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    global.fetch = mockFetch

    const result = await sendToN8N(mockRequest)

    expect(result.ok).toBe(false)
    expect(result.error).toBe('Error de conexión con n8n.')
  })
})
