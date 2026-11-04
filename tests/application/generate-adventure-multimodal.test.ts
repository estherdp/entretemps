// tests/application/generate-adventure-multimodal.test.ts

import { describe, it, expect, vi } from 'vitest'
import { generateAdventureMultimodal } from '@/application/generate-adventure-multimodal'
import { AIProviderQuotaError } from '@/domain/errors'
import type { IAdventureProvider, IImageGenerator, IImageSearcher } from '@/domain/services'
import type { IImageCacheRepository } from '@/domain/repositories'
import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

const mockWizardData: WizardData = {
  occasion: 'birthday',
  ages: { min: 6, max: 10 },
  kidsCount: 4,
  interests: 'aventuras',
  place: 'home',
  adventureType: 'adventure',
  tone: 'exciting',
  difficulty: 'medium',
}

const createMockPack = (): GeneratedAdventurePack => ({
  id: 'test-id',
  title: 'El Tesoro Escondido',
  narrator: { name: 'Capitana Brisa', description: 'Una pirata amable' },
  estimatedDurationMinutes: 60,
  ageRange: { min: 6, max: 10 },
  participants: 4,
  difficulty: 'medium',
  tone: 'exciting',
  adventureType: 'adventure',
  place: 'home',
  materials: ['papel', 'lápices'],
  introduction: { story: 'Intro story', setupForParents: 'Setup guide' },
  missions: [
    { order: 1, title: 'Mission 1', story: 'Story 1', parentGuide: 'Guide 1', successCondition: 'Success 1' },
  ],
  conclusion: { story: 'Conclusion story', celebrationTip: 'Celebration tip' },
  createdAt: new Date().toISOString(),
})

const createProvider = (pack = createMockPack()): IAdventureProvider => ({
  generateAdventure: vi.fn().mockResolvedValue(pack),
})

const createGenerator = (result?: Error): IImageGenerator => ({
  generateImage: result
    ? vi.fn().mockRejectedValue(result)
    : vi.fn().mockImplementation(async (prompt: string) => ({ url: 'https://img.test/ai.png', prompt })),
})

const createSearcher = (result: 'found' | 'none' | Error = 'found'): IImageSearcher => ({
  searchCoverImage:
    result instanceof Error
      ? vi.fn().mockRejectedValue(result)
      : vi.fn().mockResolvedValue(
          result === 'found'
            ? {
                url: 'https://img.test/pexels.jpg',
                prompt: 'pexels query',
                attribution: { photographer: 'Ana', sourceUrl: 'https://pexels.test' },
              }
            : null
        ),
})

const createCache = (hit = false): IImageCacheRepository => ({
  get: vi.fn().mockResolvedValue(
    hit
      ? { query: 'cached', url: 'https://img.test/cached.jpg', photographer: null, sourceUrl: null, createdAt: '' }
      : null
  ),
  save: vi.fn().mockResolvedValue(undefined),
  cleanExpired: vi.fn(),
})

describe('generateAdventureMultimodal', () => {
  describe('Solo texto (modo por defecto)', () => {
    it('should return the pack without image nor warnings when no image providers are injected', async () => {
      const result = await generateAdventureMultimodal(mockWizardData, createProvider())

      expect(result.ok).toBe(true)
      expect(result.pack?.image).toBeUndefined()
      expect(result.warnings).toBeUndefined()
    })

    it('should derive the number of missions from the difficulty', async () => {
      const provider = createProvider()

      await generateAdventureMultimodal({ ...mockWizardData, difficulty: 'hard' }, provider)

      expect(provider.generateAdventure).toHaveBeenCalledWith(
        expect.objectContaining({ difficulty: 'hard' }),
        'es',
        { phases: 5, puzzlesPerPhase: 2, screenFree: true }
      )
    })
  })

  describe('Portada con generador de IA', () => {
    it('should set the generated image using a prompt built from the pack', async () => {
      const generator = createGenerator()

      const result = await generateAdventureMultimodal(mockWizardData, createProvider(), undefined, undefined, generator)

      expect(result.pack?.image?.url).toBe('https://img.test/ai.png')
      const prompt = vi.mocked(generator.generateImage).mock.calls[0][0]
      expect(prompt).toContain('El Tesoro Escondido')
      expect(prompt).toContain('Capitana Brisa')
    })

    it('should leave the pack without image and warn when the generator fails', async () => {
      const result = await generateAdventureMultimodal(
        mockWizardData,
        createProvider(),
        undefined,
        undefined,
        createGenerator(new Error('Sin créditos'))
      )

      expect(result.ok).toBe(true)
      expect(result.pack?.image).toBeUndefined()
      expect(result.warnings).toEqual(
        expect.arrayContaining([
          expect.stringContaining('Sin créditos'),
          expect.stringContaining('ilustración por defecto'),
        ])
      )
    })

    it('should prioritize the generator over the searcher', async () => {
      const searcher = createSearcher()

      const result = await generateAdventureMultimodal(
        mockWizardData,
        createProvider(),
        searcher,
        undefined,
        createGenerator()
      )

      expect(result.pack?.image?.url).toBe('https://img.test/ai.png')
      expect(searcher.searchCoverImage).not.toHaveBeenCalled()
    })
  })

  describe('Portada con buscador (Pexels)', () => {
    it('should use the cached image without calling the searcher', async () => {
      const searcher = createSearcher()

      const result = await generateAdventureMultimodal(mockWizardData, createProvider(), searcher, createCache(true))

      expect(result.pack?.image?.url).toBe('https://img.test/cached.jpg')
      expect(searcher.searchCoverImage).not.toHaveBeenCalled()
    })

    it('should search and save to cache on a cache miss', async () => {
      const cache = createCache(false)

      const result = await generateAdventureMultimodal(mockWizardData, createProvider(), createSearcher(), cache)

      expect(result.pack?.image?.url).toBe('https://img.test/pexels.jpg')
      expect(cache.save).toHaveBeenCalledWith(
        expect.objectContaining({ url: 'https://img.test/pexels.jpg', photographer: 'Ana' })
      )
      expect(result.warnings).toEqual([expect.stringContaining('Ana')])
    })

    it('should fall back to the searcher when the generator fails', async () => {
      const result = await generateAdventureMultimodal(
        mockWizardData,
        createProvider(),
        createSearcher(),
        undefined,
        createGenerator(new Error('fallo'))
      )

      expect(result.pack?.image?.url).toBe('https://img.test/pexels.jpg')
    })

    it('should not fail the adventure when the searcher throws', async () => {
      const result = await generateAdventureMultimodal(
        mockWizardData,
        createProvider(),
        createSearcher(new Error('Pexels caído'))
      )

      expect(result.ok).toBe(true)
      expect(result.pack?.image).toBeUndefined()
      expect(result.warnings?.some((w) => w.includes('Pexels caído'))).toBe(true)
    })
  })

  describe('Manejo de errores', () => {
    it('should return error when adventure generation fails', async () => {
      const provider: IAdventureProvider = {
        generateAdventure: vi.fn().mockRejectedValue(new Error('API caída')),
      }

      const result = await generateAdventureMultimodal(mockWizardData, provider)

      expect(result.ok).toBe(false)
      expect(result.error).toContain('API caída')
      expect(result.errorCode).toBeUndefined()
    })

    it('should flag provider quota errors with errorCode ai_quota', async () => {
      const provider: IAdventureProvider = {
        generateAdventure: vi.fn().mockRejectedValue(new AIProviderQuotaError()),
      }

      const result = await generateAdventureMultimodal(mockWizardData, provider)

      expect(result.ok).toBe(false)
      expect(result.errorCode).toBe('ai_quota')
    })
  })
})
