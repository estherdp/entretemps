// tests/infrastructure/ai-adapters.test.ts

import { describe, it, expect } from 'vitest'
import { OpenAIAdapter, GeminiAdapter, NanobananaAdapter } from '@/infrastructure/ai/adapters'
import type { WizardData } from '@/domain/wizard-data'

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
  it('should implement IAdventureProvider interface', () => {
    const adapter = new GeminiAdapter()
    expect(adapter.generateAdventure).toBeDefined()
    expect(typeof adapter.generateAdventure).toBe('function')
  })

  it('should generate adventure with correct structure', async () => {
    const adapter = new GeminiAdapter()
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
    const geminiAdapter = new GeminiAdapter()

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
  it('should implement IImageGenerator interface', () => {
    const adapter = new NanobananaAdapter()
    expect(adapter.generateImage).toBeDefined()
    expect(typeof adapter.generateImage).toBe('function')
  })

  it('should generate image with correct structure', async () => {
    const adapter = new NanobananaAdapter()
    const prompt = 'Una selva tropical mágica con animales'
    const image = await adapter.generateImage(prompt)

    expect(image).toBeDefined()
    expect(image.url).toBeTruthy()
    expect(typeof image.url).toBe('string')
    expect(image.url).toMatch(/^https?:\/\//)

    expect(image.prompt).toBe(prompt)
  })

  it('should return consistent images for same prompt', async () => {
    const adapter = new NanobananaAdapter()
    const prompt = 'Test prompt consistente'

    const image1 = await adapter.generateImage(prompt)
    const image2 = await adapter.generateImage(prompt)

    // El hash debería ser el mismo, por lo tanto la URL también
    expect(image1.url).toBe(image2.url)
    expect(image1.prompt).toBe(image2.prompt)
  })

  it('should return different images for different prompts', async () => {
    const adapter = new NanobananaAdapter()

    const image1 = await adapter.generateImage('Prompt A')
    const image2 = await adapter.generateImage('Prompt B')

    // Prompts diferentes deberían dar URLs diferentes
    expect(image1.url).not.toBe(image2.url)
  })
})

describe('Interface Compliance', () => {
  it('all adventure providers should have same method signature', () => {
    const openai = new OpenAIAdapter()
    const gemini = new GeminiAdapter()

    // Ambos deberían tener el mismo método
    expect(openai.generateAdventure.length).toBe(gemini.generateAdventure.length)
  })

  it('adventure providers should be interchangeable', async () => {
    const providers = [new OpenAIAdapter(), new GeminiAdapter()]

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
