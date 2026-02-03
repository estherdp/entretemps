// tests/infrastructure/ai-adapters.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OpenAIAdapter, GeminiAdapter, NanobananaAdapter, PollinationsImageAdapter } from '@/infrastructure/ai/adapters'
import type { WizardData } from '@/domain/wizard-data'

// Mock del SDK de Google Gemini para tests de integración
const mockGenerateContentIntegration = vi.fn()

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class MockGoogleGenAI {
      models = {
        generateContent: mockGenerateContentIntegration,
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

describe('OpenAIAdapter', () => {
  it('should implement IAdventureProvider interface', () => {
    const adapter = new OpenAIAdapter()
    expect(adapter.generateAdventure).toBeDefined()
    expect(typeof adapter.generateAdventure).toBe('function')
  })

  it('should generate adventure with correct structure', async () => {
    const adapter = new OpenAIAdapter()
    const pack = await adapter.generateAdventure(mockWizardData, 'es', {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    })

    // Verificar estructura básica
    expect(pack).toBeDefined()
    expect(pack.id).toBeDefined()
    expect(pack.title).toBeTruthy()
    expect(typeof pack.title).toBe('string')

    // Verificar imagen
    expect(pack.image).toBeDefined()
    expect(pack.image.url).toBeTruthy()
    expect(pack.image.prompt).toBeTruthy()

    // Verificar metadatos
    expect(pack.estimatedDurationMinutes).toBeGreaterThan(0)
    expect(pack.ageRange).toBeDefined()
    expect(pack.ageRange.min).toBeLessThanOrEqual(pack.ageRange.max)
    expect(pack.participants).toBeGreaterThan(0)
    expect(pack.difficulty).toMatch(/^(easy|medium|hard)$/)

    // Verificar contenido
    expect(pack.introduction).toBeDefined()
    expect(pack.introduction.story).toBeTruthy()
    expect(pack.introduction.setupForParents).toBeTruthy()

    expect(pack.missions).toBeDefined()
    expect(Array.isArray(pack.missions)).toBe(true)
    expect(pack.missions.length).toBe(3)

    // Verificar cada misión
    pack.missions.forEach((mission, index) => {
      expect(mission.order).toBe(index + 1)
      expect(mission.title).toBeTruthy()
      expect(mission.story).toBeTruthy()
      expect(mission.parentGuide).toBeTruthy()
      expect(mission.successCondition).toBeTruthy()
    })

    expect(pack.conclusion).toBeDefined()
    expect(pack.conclusion.story).toBeTruthy()
    expect(pack.conclusion.celebrationTip).toBeTruthy()

    expect(pack.materials).toBeDefined()
    expect(Array.isArray(pack.materials)).toBe(true)
  })

  it('should respect wizard data parameters', async () => {
    const adapter = new OpenAIAdapter()
    const customWizardData: WizardData = {
      ages: { min: 8, max: 12 },
      kidsCount: 6,
      difficulty: 'hard',
      tone: 'enigmatic',
      adventureType: 'mystery',
    }

    const pack = await adapter.generateAdventure(customWizardData, 'es', {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    })

    expect(pack.difficulty).toBe('hard')
    expect(pack.tone).toBe('enigmatic')
    expect(pack.adventureType).toBe('mystery')
  })
})

describe('GeminiAdapter', () => {
  beforeEach(() => {
    // Configurar mock para devolver aventura válida
    mockGenerateContentIntegration.mockResolvedValue({
      text: JSON.stringify({
        id: crypto.randomUUID(),
        title: 'El Secreto de la Selva Esmeralda',
        image: {
          url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
          prompt: 'Selva tropical vibrante con cascadas y animales exóticos, arte digital para niños',
        },
        estimatedDurationMinutes: 60,
        ageRange: { min: 6, max: 10 },
        participants: 4,
        difficulty: 'medium',
        tone: 'exciting',
        adventureType: 'adventure',
        place: 'home',
        materials: ['Hojas de papel', 'Pinturas', 'Telas verdes'],
        introduction: {
          story: 'En el corazón de la Selva Esmeralda...',
          setupForParents: 'Transforma tu hogar...',
        },
        missions: [
          {
            order: 1,
            title: 'El Guardián Tucán',
            story: 'El sabio Tucán guardián...',
            parentGuide: 'Proporciona materiales...',
            successCondition: 'El equipo completa un mapa...',
          },
          {
            order: 2,
            title: 'La Cascada de los Deseos',
            story: 'Una cascada mágica...',
            parentGuide: 'Prepara plantillas...',
            successCondition: 'Cada niño crea mariposas...',
          },
          {
            order: 3,
            title: 'El Árbol de los Mil Colores',
            story: 'El árbol aparece...',
            parentGuide: 'Guía a los niños...',
            successCondition: 'Los niños cantan la canción...',
          },
        ],
        conclusion: {
          story: 'El Árbol florece en toda su gloria...',
          celebrationTip: 'Realiza una ceremonia...',
        },
        createdAt: new Date().toISOString(),
      }),
    })
  })

  it('should implement IAdventureProvider interface', () => {
    const adapter = new GeminiAdapter('test-api-key')
    expect(adapter.generateAdventure).toBeDefined()
    expect(typeof adapter.generateAdventure).toBe('function')
  })

  it('should generate adventure with correct structure', async () => {
    const adapter = new GeminiAdapter('test-api-key')
    const pack = await adapter.generateAdventure(mockWizardData, 'es', {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    })

    expect(pack).toBeDefined()
    expect(pack.id).toBeDefined()
    expect(pack.title).toBeTruthy()
    expect(pack.image).toBeDefined()
    expect(pack.missions.length).toBe(3)
  })

  it('should generate different content than OpenAI', async () => {
    const openaiAdapter = new OpenAIAdapter()
    const geminiAdapter = new GeminiAdapter('test-api-key')

    const openaiPack = await openaiAdapter.generateAdventure(mockWizardData, 'es', {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    })

    const geminiPack = await geminiAdapter.generateAdventure(mockWizardData, 'es', {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    })

    // Los títulos deben ser diferentes (son mocks distintos)
    expect(openaiPack.title).not.toBe(geminiPack.title)
  })
})

describe('NanobananaAdapter', () => {
  beforeEach(() => {
    // Mock para que generateContent devuelva una imagen válida
    // Estructura esperada por Gemini Image Generation API
    mockGenerateContentIntegration.mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                },
              },
            ],
          },
        },
      ],
    })
  })

  it('should implement IImageGenerator interface', () => {
    const adapter = new NanobananaAdapter('test-api-key')
    expect(adapter.generateImage).toBeDefined()
    expect(typeof adapter.generateImage).toBe('function')
  })

  it('should generate image with correct structure', async () => {
    const adapter = new NanobananaAdapter('test-api-key')
    const prompt = 'Una selva tropical mágica con animales'
    const image = await adapter.generateImage(prompt)

    expect(image).toBeDefined()
    expect(image.url).toBeTruthy()
    expect(typeof image.url).toBe('string')
    expect(image.url).toMatch(/^data:image/)

    expect(image.prompt).toBe(prompt)
  })

  it('should return consistent images for same prompt', async () => {
    const adapter = new NanobananaAdapter('test-api-key')
    const prompt = 'Test prompt consistente'

    const image1 = await adapter.generateImage(prompt)
    const image2 = await adapter.generateImage(prompt)

    // Ambas deberían tener la misma estructura (aunque el contenido puede variar)
    expect(image1.url).toBeTruthy()
    expect(image2.url).toBeTruthy()
    expect(image1.prompt).toBe(image2.prompt)
  })

  it('should return different images for different prompts', async () => {
    const adapter = new NanobananaAdapter('test-api-key')

    const image1 = await adapter.generateImage('Prompt A')
    const image2 = await adapter.generateImage('Prompt B')

    // Prompts diferentes deberían estar reflejados
    expect(image1.prompt).not.toBe(image2.prompt)
    expect(image1.prompt).toBe('Prompt A')
    expect(image2.prompt).toBe('Prompt B')
  })
})

describe('PollinationsImageAdapter', () => {
  // Mock de fetch global para simular respuestas de Pollinations
  const originalFetch = global.fetch

  beforeEach(() => {
    // Mock de fetch que simula respuesta exitosa de Pollinations
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
    })
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('should implement IImageGenerator interface', () => {
    const adapter = new PollinationsImageAdapter('test-api-key')
    expect(adapter.generateImage).toBeDefined()
    expect(typeof adapter.generateImage).toBe('function')
  })

  it('should throw error if API key is not configured', () => {
    const originalEnv = process.env.POLLINATIONS_API_KEY
    delete process.env.POLLINATIONS_API_KEY

    expect(() => new PollinationsImageAdapter()).toThrow(
      'POLLINATIONS_API_KEY no configurada'
    )

    process.env.POLLINATIONS_API_KEY = originalEnv
  })

  it('should generate image with correct structure', async () => {
    const adapter = new PollinationsImageAdapter('test-api-key')
    const prompt = 'Una selva tropical mágica con animales'
    const image = await adapter.generateImage(prompt)

    expect(image).toBeDefined()
    expect(image.url).toBeTruthy()
    expect(typeof image.url).toBe('string')
    expect(image.url).toContain('image.pollinations.ai')
    expect(image.url).toContain('/prompt/')
    expect(image.url).toContain('width=1024')
    expect(image.url).toContain('height=1024')
    expect(image.url).toContain('model=flux')

    // Verificar que se aplicó el style wrapper
    expect(image.prompt).toContain(prompt)
    expect(image.prompt).toContain('Cartoon illustration style')
  })

  it('should apply style wrapper to prompt', async () => {
    const adapter = new PollinationsImageAdapter('test-api-key')
    const originalPrompt = 'Un dragón amigable'
    const image = await adapter.generateImage(originalPrompt)

    expect(image.prompt).toContain(originalPrompt)
    expect(image.prompt).toContain('Cartoon illustration style')
    expect(image.prompt).toContain('vibrant colors')
    expect(image.prompt).toContain('cute animated characters')
    expect(image.prompt).toContain('no text')
    expect(image.prompt).toContain('no realistic people')
  })

  it('should include API key in URL as query parameter', async () => {
    const adapter = new PollinationsImageAdapter('test-api-key-123')
    const image = await adapter.generateImage('test prompt')

    // Verificar que la API key está en la URL generada
    expect(image.url).toContain('auth=test-api-key-123')
    expect(image.url).toContain('image.pollinations.ai')
  })

  it('should generate different seeds for different calls', async () => {
    const adapter = new PollinationsImageAdapter('test-api-key')
    const prompt = 'Test prompt'

    const image1 = await adapter.generateImage(prompt)
    const image2 = await adapter.generateImage(prompt)

    // Mismo prompt pero diferentes seeds = diferentes URLs
    expect(image1.url).not.toBe(image2.url)

    // Extraer seeds de las URLs
    const seed1 = new URL(image1.url).searchParams.get('seed')
    const seed2 = new URL(image2.url).searchParams.get('seed')

    expect(seed1).not.toBe(seed2)
  })

  it('should generate valid URL even without verification', async () => {
    const adapter = new PollinationsImageAdapter('test-api-key')
    const image = await adapter.generateImage('test prompt')

    // La URL debe usar el nuevo formato de Pollinations (image.pollinations.ai/prompt)
    expect(image.url).toMatch(/^https:\/\/image\.pollinations\.ai\/prompt\//)
    expect(image.url).toContain('auth=test-api-key')
    expect(image.url).toContain('model=flux')
  })
})

describe('Interface Compliance', () => {
  beforeEach(() => {
    // Configurar mock para GeminiAdapter igual que en su describe
    mockGenerateContentIntegration.mockResolvedValue({
      text: JSON.stringify({
        id: crypto.randomUUID(),
        title: 'El Secreto de la Selva Esmeralda',
        image: {
          url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
          prompt: 'Selva tropical vibrante con cascadas y animales exóticos, arte digital para niños',
        },
        estimatedDurationMinutes: 60,
        ageRange: { min: 6, max: 10 },
        participants: 4,
        difficulty: 'medium',
        tone: 'exciting',
        adventureType: 'adventure',
        place: 'home',
        materials: ['Hojas de papel', 'Pinturas', 'Telas verdes'],
        introduction: {
          story: 'En el corazón de la Selva Esmeralda...',
          setupForParents: 'Transforma tu hogar...',
        },
        missions: [
          {
            order: 1,
            title: 'El Guardián Tucán',
            story: 'El sabio Tucán guardián...',
            parentGuide: 'Proporciona materiales...',
            successCondition: 'El equipo completa un mapa...',
          },
          {
            order: 2,
            title: 'La Cascada de los Deseos',
            story: 'Una cascada mágica...',
            parentGuide: 'Prepara plantillas...',
            successCondition: 'Cada niño crea mariposas...',
          },
          {
            order: 3,
            title: 'El Árbol de los Mil Colores',
            story: 'El árbol aparece...',
            parentGuide: 'Guía a los niños...',
            successCondition: 'Los niños cantan la canción...',
          },
        ],
        conclusion: {
          story: 'El Árbol florece en toda su gloria...',
          celebrationTip: 'Realiza una ceremonia...',
        },
        createdAt: new Date().toISOString(),
      }),
    })
  })

  it('all adventure providers should have same method signature', () => {
    const openai = new OpenAIAdapter()
    const gemini = new GeminiAdapter('test-api-key')

    // Ambos deberían tener el mismo método
    expect(openai.generateAdventure.length).toBe(gemini.generateAdventure.length)
  })

  it('adventure providers should be interchangeable', async () => {
    const providers = [new OpenAIAdapter(), new GeminiAdapter('test-api-key')]

    for (const provider of providers) {
      const pack = await provider.generateAdventure(mockWizardData, 'es', {
        phases: 3,
        puzzlesPerPhase: 2,
        screenFree: true,
      })

      // Todos deberían retornar la misma estructura
      expect(pack).toHaveProperty('id')
      expect(pack).toHaveProperty('title')
      expect(pack).toHaveProperty('image')
      expect(pack).toHaveProperty('missions')
      expect(pack.missions).toHaveLength(3)
    }
  })
})
