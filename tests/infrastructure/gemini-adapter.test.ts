// tests/infrastructure/gemini-adapter.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GeminiAdapter } from '@/infrastructure/ai/adapters/gemini.adapter'
import type { WizardData } from '@/domain/wizard-data'

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

const validAdventurePackJSON = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Aventura de Prueba',
  image: {
    url: 'https://images.unsplash.com/photo-1234567890?w=800',
    prompt: 'Una aventura mágica',
  },
  estimatedDurationMinutes: 60,
  ageRange: { min: 6, max: 10 },
  participants: 4,
  difficulty: 'medium',
  tone: 'exciting',
  adventureType: 'adventure',
  place: 'home',
  materials: ['Papel', 'Pinturas', 'Tijeras'],
  introduction: {
    story: 'Una historia introductoria',
    setupForParents: 'Instrucciones para padres',
  },
  missions: [
    {
      order: 1,
      title: 'Misión 1',
      story: 'Historia de la misión',
      parentGuide: 'Guía para padres',
      successCondition: 'Condición de éxito',
    },
    {
      order: 2,
      title: 'Misión 2',
      story: 'Historia de la misión 2',
      parentGuide: 'Guía para padres 2',
      successCondition: 'Condición de éxito 2',
    },
  ],
  conclusion: {
    story: 'Conclusión de la aventura',
    celebrationTip: 'Tip de celebración',
  },
  createdAt: new Date().toISOString(),
}

describe('GeminiAdapter - Unit Tests with SDK Mocks', () => {
  let adapter: GeminiAdapter

  beforeEach(() => {
    vi.clearAllMocks()
    mockGenerateContent.mockReset()
    // Crear adapter con API key de prueba
    adapter = new GeminiAdapter('test-api-key', 'gemini-2.0-flash-exp')
  })

  describe('Constructor', () => {
    it('should throw error if GEMINI_API_KEY is not provided', () => {
      expect(() => {
        new GeminiAdapter(undefined, 'gemini-2.0-flash-exp')
      }).toThrow('GEMINI_API_KEY no configurada')
    })

    it('should accept API key as parameter', () => {
      expect(() => {
        new GeminiAdapter('test-key')
      }).not.toThrow()
    })

    it('should use custom temperature and maxTokens when provided', () => {
      const customAdapter = new GeminiAdapter('test-key', 'gemini-2.0-flash-exp', 0.5, 2000)
      expect(customAdapter).toBeDefined()
    })

    it('should use default temperature and maxTokens when not provided', () => {
      const defaultAdapter = new GeminiAdapter('test-key')
      expect(defaultAdapter).toBeDefined()
    })
  })

  describe('generateAdventure - Success Cases', () => {
    it('should parse and validate valid JSON response', async () => {
      // Mockear respuesta válida
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(validAdventurePackJSON),
      })

      const result = await adapter.generateAdventure(mockWizardData, 'es', {
        phases: 2,
        puzzlesPerPhase: 2,
        screenFree: true,
      })

      expect(result).toBeDefined()
      expect(result.id).toBe(validAdventurePackJSON.id)
      expect(result.title).toBe(validAdventurePackJSON.title)
      expect(result.missions).toHaveLength(2)
      expect(mockGenerateContent).toHaveBeenCalledTimes(1)
    })

    it('should clean markdown fences from response', async () => {
      const jsonWithMarkdown = `\`\`\`json
${JSON.stringify(validAdventurePackJSON)}
\`\`\``

      mockGenerateContent.mockResolvedValue({
        text: jsonWithMarkdown,
      })

      const result = await adapter.generateAdventure(mockWizardData, 'es', {
        phases: 2,
        puzzlesPerPhase: 2,
        screenFree: true,
      })

      expect(result).toBeDefined()
      expect(result.id).toBe(validAdventurePackJSON.id)
    })

    it('should extract JSON between first { and last }', async () => {
      const textWithExtraContent = `Aquí está tu aventura:
${JSON.stringify(validAdventurePackJSON)}
Espero que te guste!`

      mockGenerateContent.mockResolvedValue({
        text: textWithExtraContent,
      })

      const result = await adapter.generateAdventure(mockWizardData, 'es', {
        phases: 2,
        puzzlesPerPhase: 2,
        screenFree: true,
      })

      expect(result).toBeDefined()
      expect(result.title).toBe(validAdventurePackJSON.title)
    })

    it('should add createdAt if missing', async () => {
      const packWithoutCreatedAt = { ...validAdventurePackJSON }
      delete (packWithoutCreatedAt as Partial<typeof validAdventurePackJSON>).createdAt

      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(packWithoutCreatedAt),
      })

      const result = await adapter.generateAdventure(mockWizardData, 'es', {
        phases: 2,
        puzzlesPerPhase: 2,
        screenFree: true,
      })

      expect(result.createdAt).toBeDefined()
      expect(typeof result.createdAt).toBe('string')
    })
  })

  describe('generateAdventure - Error Cases', () => {
    it('should throw error if response has no text', async () => {
      mockGenerateContent.mockResolvedValue({
        text: undefined,
      })

      await expect(
        adapter.generateAdventure(mockWizardData, 'es', {
          phases: 2,
          puzzlesPerPhase: 2,
          screenFree: true,
        })
      ).rejects.toThrow('La respuesta de Gemini no contiene texto')
    })

    it('should throw error if response is not valid JSON', async () => {
      mockGenerateContent.mockResolvedValue({
        text: 'This is not JSON at all',
      })

      await expect(
        adapter.generateAdventure(mockWizardData, 'es', {
          phases: 2,
          puzzlesPerPhase: 2,
          screenFree: true,
        })
      ).rejects.toThrow('No se encontró un JSON válido')
    })

    it('should throw error if JSON is malformed', async () => {
      mockGenerateContent.mockResolvedValue({
        text: '{ "id": "123", "title": "Test", invalid json }',
      })

      await expect(
        adapter.generateAdventure(mockWizardData, 'es', {
          phases: 2,
          puzzlesPerPhase: 2,
          screenFree: true,
        })
      ).rejects.toThrow('Error al parsear JSON')
    })

    it('should throw error if Zod validation fails', async () => {
      const invalidPack = {
        id: 'not-a-uuid',
        title: 'Test',
        // Faltan campos requeridos
      }

      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(invalidPack),
      })

      await expect(
        adapter.generateAdventure(mockWizardData, 'es', {
          phases: 2,
          puzzlesPerPhase: 2,
          screenFree: true,
        })
      ).rejects.toThrow('Validación falló')
    })

    it('should throw error if SDK throws error', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API quota exceeded'))

      await expect(
        adapter.generateAdventure(mockWizardData, 'es', {
          phases: 2,
          puzzlesPerPhase: 2,
          screenFree: true,
        })
      ).rejects.toThrow('Error al generar aventura con Gemini: API quota exceeded')
    })
  })

  describe('Prompt Building', () => {
    it('should include wizard data in the request', async () => {
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(validAdventurePackJSON),
      })

      await adapter.generateAdventure(mockWizardData, 'es', {
        phases: 3,
        puzzlesPerPhase: 2,
        screenFree: true,
      })

      const callArgs = mockGenerateContent.mock.calls[0][0]
      expect(callArgs.model).toBe('gemini-2.0-flash-exp')
      expect(callArgs.contents).toContain('birthday')
      expect(callArgs.contents).toContain('6-10 años')
      expect(callArgs.contents).toContain('naturaleza, aventuras')
      expect(callArgs.contents).toContain('español')
    })

    it('should respect constraints in prompt', async () => {
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(validAdventurePackJSON),
      })

      await adapter.generateAdventure(mockWizardData, 'es', {
        phases: 5,
        puzzlesPerPhase: 3,
        screenFree: false,
      })

      const callArgs = mockGenerateContent.mock.calls[0][0]
      expect(callArgs.contents).toContain('5')
      expect(callArgs.contents).toContain('EXACTAMENTE 5 misiones')
    })

    it('should apply cost control parameters (temperature and maxTokens)', async () => {
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(validAdventurePackJSON),
      })

      await adapter.generateAdventure(mockWizardData, 'es', {
        phases: 3,
        puzzlesPerPhase: 2,
        screenFree: true,
      })

      const callArgs = mockGenerateContent.mock.calls[0][0]
      expect(callArgs.config).toBeDefined()
      expect(callArgs.config.temperature).toBe(0.7)
      // El adapter usa defaults o lee de process.env
      // En tests, el default es 2500 según la configuración actual
      expect(callArgs.config.maxOutputTokens).toBe(2500)
      expect(callArgs.config.responseMimeType).toBe('application/json')
    })

    it('should use custom temperature and maxTokens when provided', async () => {
      const customAdapter = new GeminiAdapter('test-key', 'gemini-2.0-flash-exp', 0.3, 2000)

      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(validAdventurePackJSON),
      })

      await customAdapter.generateAdventure(mockWizardData, 'es', {
        phases: 3,
        puzzlesPerPhase: 2,
        screenFree: true,
      })

      const callArgs = mockGenerateContent.mock.calls[0][0]
      expect(callArgs.config.temperature).toBe(0.3)
      expect(callArgs.config.maxOutputTokens).toBe(2000)
    })
  })

  describe('regenerateSingleMission', () => {
    const mockContext = {
      title: 'La Aventura del Tesoro',
      ageRange: { min: 6, max: 10 },
      adventureType: 'adventure' as const,
      tone: 'exciting' as const,
      place: 'home' as const,
      difficulty: 'medium' as const,
      existingMissions: [
        {
          order: 1,
          title: 'Encuentra el mapa',
          story: 'Historia de la misión 1',
        },
        {
          order: 3,
          title: 'Descubre el tesoro',
          story: 'Historia de la misión 3',
        },
      ],
    }

    const mockCurrentMission = {
      order: 2,
      title: 'Descifra las pistas',
      story: 'Historia de la misión 2',
      parentGuide: 'Guía para padres',
      successCondition: 'Resolver el acertijo',
    }

    const validMissionJSON = {
      order: 2,
      title: 'Descifra las pistas mejoradas',
      story: 'Nueva historia de la misión 2',
      parentGuide: 'Nueva guía para padres',
      successCondition: 'Resolver el nuevo acertijo',
    }

    it('should regenerate a mission successfully', async () => {
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(validMissionJSON),
      })

      const result = await adapter.regenerateSingleMission(
        mockContext,
        mockCurrentMission,
        undefined,
        'es'
      )

      expect(result).toEqual(validMissionJSON)
      expect(mockGenerateContent).toHaveBeenCalledTimes(1)

      const callArgs = mockGenerateContent.mock.calls[0][0]
      expect(callArgs.config.responseMimeType).toBe('application/json')
      expect(callArgs.config.maxOutputTokens).toBe(1500) // Menos tokens para una sola misión
    })

    it('should include context in the prompt', async () => {
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(validMissionJSON),
      })

      await adapter.regenerateSingleMission(
        mockContext,
        mockCurrentMission,
        undefined,
        'es'
      )

      const callArgs = mockGenerateContent.mock.calls[0][0]
      const prompt = callArgs.contents

      expect(prompt).toContain('La Aventura del Tesoro')
      expect(prompt).toContain('6-10 años')
      expect(prompt).toContain('adventure')
      expect(prompt).toContain('exciting')
      expect(prompt).toContain('home')
      expect(prompt).toContain('medium')
    })

    it('should include existing missions in the prompt for coherence', async () => {
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(validMissionJSON),
      })

      await adapter.regenerateSingleMission(
        mockContext,
        mockCurrentMission,
        undefined,
        'es'
      )

      const callArgs = mockGenerateContent.mock.calls[0][0]
      const prompt = callArgs.contents

      expect(prompt).toContain('Encuentra el mapa')
      expect(prompt).toContain('Descubre el tesoro')
      expect(prompt).toContain('MISIONES EXISTENTES')
    })

    it('should include feedback in the prompt when provided', async () => {
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(validMissionJSON),
      })

      const feedback = 'Hazla más divertida con elementos de humor'

      await adapter.regenerateSingleMission(
        mockContext,
        mockCurrentMission,
        feedback,
        'es'
      )

      const callArgs = mockGenerateContent.mock.calls[0][0]
      const prompt = callArgs.contents

      expect(prompt).toContain(feedback)
      expect(prompt).toContain('FEEDBACK DEL USUARIO')
    })

    it('should handle JSON wrapped in markdown code blocks', async () => {
      mockGenerateContent.mockResolvedValue({
        text: '```json\n' + JSON.stringify(validMissionJSON) + '\n```',
      })

      const result = await adapter.regenerateSingleMission(
        mockContext,
        mockCurrentMission,
        undefined,
        'es'
      )

      expect(result).toEqual(validMissionJSON)
    })

    it('should throw error if response is not valid JSON', async () => {
      mockGenerateContent.mockResolvedValue({
        text: 'This is not JSON',
      })

      await expect(
        adapter.regenerateSingleMission(mockContext, mockCurrentMission, undefined, 'es')
      ).rejects.toThrow('No se encontró un JSON válido')
    })

    it('should throw error if mission validation fails', async () => {
      const invalidMission = {
        order: 2,
        title: 'Test',
        // Faltan campos requeridos
      }

      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(invalidMission),
      })

      await expect(
        adapter.regenerateSingleMission(mockContext, mockCurrentMission, undefined, 'es')
      ).rejects.toThrow('Validación de misión falló')
    })

    it('should correct the order if it does not match expected', async () => {
      const missionWithWrongOrder = {
        ...validMissionJSON,
        order: 5, // Orden incorrecto
      }

      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(missionWithWrongOrder),
      })

      const result = await adapter.regenerateSingleMission(
        mockContext,
        mockCurrentMission,
        undefined,
        'es'
      )

      expect(result.order).toBe(2) // Debe corregir al orden esperado
    })

    it('should throw error if SDK throws error', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Network error'))

      await expect(
        adapter.regenerateSingleMission(mockContext, mockCurrentMission, undefined, 'es')
      ).rejects.toThrow('Error al regenerar misión con Gemini: Network error')
    })

    it('should use Spanish language instruction for es locale', async () => {
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(validMissionJSON),
      })

      await adapter.regenerateSingleMission(
        mockContext,
        mockCurrentMission,
        undefined,
        'es'
      )

      const callArgs = mockGenerateContent.mock.calls[0][0]
      expect(callArgs.contents).toContain('español')
    })

    it('should use English language instruction for en locale', async () => {
      mockGenerateContent.mockResolvedValue({
        text: JSON.stringify(validMissionJSON),
      })

      await adapter.regenerateSingleMission(
        mockContext,
        mockCurrentMission,
        undefined,
        'en'
      )

      const callArgs = mockGenerateContent.mock.calls[0][0]
      expect(callArgs.contents).toContain('inglés')
    })
  })
})
