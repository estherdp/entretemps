// tests/infrastructure/gemini-adapter.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GeminiAdapter } from '@/infrastructure/ai/adapters/gemini.adapter'
import { AIProviderQuotaError } from '@/domain/errors'
import type { WizardData } from '@/domain/wizard-data'
import type { AdventureContext } from '@/domain/services'
import type { GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'
import { createAIAdventureOutput, createAIMissionOutput } from '../fixtures/ai-adventure-output'

// Mock del SDK de Google Gemini
const mockGenerateContent = vi.fn()

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class MockGoogleGenAI {
      models = {
        generateContent: mockGenerateContent,
      }
    },
  }
})

const mockWizardData: WizardData = {
  occasion: 'birthday',
  ages: { min: 6, max: 10 },
  kidsCount: 4,
  interests: 'naturaleza, aventuras',
  place: 'home',
  adventureType: 'adventure',
  tone: 'exciting',
  difficulty: 'medium',
}

const constraints = { phases: 2, puzzlesPerPhase: 2, screenFree: true }

const mockContext: AdventureContext = {
  title: 'El Secreto de la Selva Esmeralda',
  ageRange: { min: 6, max: 10 },
  adventureType: 'adventure',
  tone: 'exciting',
  place: 'garden',
  difficulty: 'medium',
  narrator: { name: 'Tucán Tomás', description: 'Un tucán sabio' },
  existingMissions: [{ order: 1, title: 'El Guardián', story: 'El guardián vigila la entrada' }],
}

const currentMission: GeneratedAdventurePackMission = {
  order: 2,
  title: 'La Cascada',
  story: 'Una cascada mágica',
  parentGuide: 'Prepara agua',
  successCondition: 'Cruzan la cascada',
}

function lastRequest() {
  return mockGenerateContent.mock.calls[mockGenerateContent.mock.calls.length - 1][0]
}

describe('GeminiAdapter', () => {
  let adapter: GeminiAdapter

  beforeEach(() => {
    mockGenerateContent.mockReset()
    adapter = new GeminiAdapter('test-api-key', 'gemini-2.5-flash-lite')
  })

  describe('Constructor', () => {
    it('should throw error if GEMINI_API_KEY is not provided', () => {
      const original = process.env.GEMINI_API_KEY
      delete process.env.GEMINI_API_KEY
      expect(() => new GeminiAdapter()).toThrow('GEMINI_API_KEY no configurada')
      process.env.GEMINI_API_KEY = original
    })
  })

  describe('generateAdventure', () => {
    it('should return a pack with generated id, createdAt and playable missions', async () => {
      mockGenerateContent.mockResolvedValue({ text: JSON.stringify(createAIAdventureOutput(2)) })

      const pack = await adapter.generateAdventure(mockWizardData, 'es', constraints)

      expect(pack.id).toMatch(/^[0-9a-f-]{36}$/)
      expect(pack.createdAt).toBeTruthy()
      expect(pack.image).toBeUndefined()
      expect(pack.narrator?.name).toBe('Tucán Tomás')
      expect(pack.missions).toHaveLength(2)
      expect(pack.missions[0].challenge?.solution).toBe('Solución 1')
      expect(pack.missions[0].clueCards?.[0].hidingSpot).toBe('Debajo del cojín')
    })

    it('should request structured JSON output with the adventure schema', async () => {
      mockGenerateContent.mockResolvedValue({ text: JSON.stringify(createAIAdventureOutput(2)) })

      await adapter.generateAdventure(mockWizardData, 'es', constraints)

      const { config, model } = lastRequest()
      expect(model).toBe('gemini-2.5-flash-lite')
      expect(config.responseMimeType).toBe('application/json')
      expect(config.responseJsonSchema).toMatchObject({ type: 'object' })
      expect(config.responseJsonSchema.$schema).toBeUndefined()
      expect(config.responseJsonSchema.required).toContain('missions')
    })

    it('should include wizard data and constraints in the prompt', async () => {
      mockGenerateContent.mockResolvedValue({ text: JSON.stringify(createAIAdventureOutput(2)) })

      await adapter.generateAdventure(mockWizardData, 'es', constraints)

      const { contents } = lastRequest()
      expect(contents).toContain('naturaleza, aventuras')
      expect(contents).toContain('6-10 años')
      expect(contents).toContain('Exactamente 2 misiones')
      expect(contents).toContain('español')
    })

    it('should throw when the response misses playable fields', async () => {
      const output = createAIAdventureOutput(1) as unknown as Record<string, unknown>
      const missions = output.missions as Array<Record<string, unknown>>
      delete missions[0].challenge
      mockGenerateContent.mockResolvedValue({ text: JSON.stringify(output) })

      await expect(adapter.generateAdventure(mockWizardData, 'es', constraints)).rejects.toThrow(
        'Validación falló'
      )
    })

    it('should throw when the response is truncated JSON', async () => {
      mockGenerateContent.mockResolvedValue({ text: '{"title": "Aventura' })

      await expect(adapter.generateAdventure(mockWizardData, 'es', constraints)).rejects.toThrow(
        '¿respuesta truncada?'
      )
    })

    it('should throw when the response is empty', async () => {
      mockGenerateContent.mockResolvedValue({ text: undefined })

      await expect(adapter.generateAdventure(mockWizardData, 'es', constraints)).rejects.toThrow(
        'no contiene texto'
      )
    })

    it('should translate HTTP 429 into AIProviderQuotaError', async () => {
      mockGenerateContent.mockRejectedValue(Object.assign(new Error('Too many requests'), { status: 429 }))

      await expect(adapter.generateAdventure(mockWizardData, 'es', constraints)).rejects.toBeInstanceOf(
        AIProviderQuotaError
      )
    })

    it('should wrap other SDK errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Network down'))

      await expect(adapter.generateAdventure(mockWizardData, 'es', constraints)).rejects.toThrow(
        'Error al llamar a Gemini: Network down'
      )
    })
  })

  describe('regenerateSingleMission', () => {
    it('should return the regenerated mission keeping the original order', async () => {
      mockGenerateContent.mockResolvedValue({ text: JSON.stringify(createAIMissionOutput(7)) })

      const mission = await adapter.regenerateSingleMission(mockContext, currentMission, undefined, 'es')

      expect(mission.order).toBe(2)
      expect(mission.challenge).toBeDefined()
      expect(lastRequest().config.responseJsonSchema.required).toContain('challenge')
    })

    it('should include context, other missions and feedback in the prompt', async () => {
      mockGenerateContent.mockResolvedValue({ text: JSON.stringify(createAIMissionOutput(2)) })

      await adapter.regenerateSingleMission(mockContext, currentMission, 'Que sea más corta', 'en')

      const { contents } = lastRequest()
      expect(contents).toContain('El Secreto de la Selva Esmeralda')
      expect(contents).toContain('Tucán Tomás')
      expect(contents).toContain('El Guardián')
      expect(contents).toContain('Que sea más corta')
      expect(contents).toContain('inglés')
    })

    it('should translate quota errors when regenerating', async () => {
      mockGenerateContent.mockRejectedValue(new Error('429 RESOURCE_EXHAUSTED'))

      await expect(
        adapter.regenerateSingleMission(mockContext, currentMission, undefined, 'es')
      ).rejects.toBeInstanceOf(AIProviderQuotaError)
    })
  })
})
