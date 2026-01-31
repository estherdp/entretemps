// tests/application/generate-adventure-multimodal.test.ts

import { describe, it, expect, vi } from 'vitest'
import { generateAdventureMultimodal } from '@/application/generate-adventure-multimodal'
import type { IAdventureProvider, IImageGenerator, IImageSearcher } from '@/domain/services'
import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack, GeneratedAdventurePackImage } from '@/domain/generated-adventure-pack'
import type { ImageCacheRepository } from '@/infrastructure/supabase/image-cache-repository'

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
  title: 'Test Adventure',
  image: {
    url: 'https://example.com/old-image.jpg',
    prompt: 'Una selva mágica',
  },
  estimatedDurationMinutes: 60,
  ageRange: { min: 6, max: 10 },
  participants: 4,
  difficulty: 'medium',
  tone: 'exciting',
  adventureType: 'adventure',
  place: 'home',
  materials: ['papel', 'lápices'],
  introduction: {
    story: 'Intro story',
    setupForParents: 'Setup guide',
  },
  missions: [
    {
      order: 1,
      title: 'Mission 1',
      story: 'Story 1',
      parentGuide: 'Guide 1',
      successCondition: 'Success 1',
    },
    {
      order: 2,
      title: 'Mission 2',
      story: 'Story 2',
      parentGuide: 'Guide 2',
      successCondition: 'Success 2',
    },
    {
      order: 3,
      title: 'Mission 3',
      story: 'Story 3',
      parentGuide: 'Guide 3',
      successCondition: 'Success 3',
    },
  ],
  conclusion: {
    story: 'Conclusion story',
    celebrationTip: 'Celebration tip',
  },
  createdAt: new Date().toISOString(),
})

describe('generateAdventureMultimodal', () => {
  describe('Orquestación básica', () => {
    it('should generate adventure using only adventure provider', async () => {
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(createMockPack()),
      }

      const result = await generateAdventureMultimodal(mockWizardData, mockProvider)

      expect(result.ok).toBe(true)
      expect(result.pack).toBeDefined()
      expect(result.pack?.title).toBe('Test Adventure')
      expect(mockProvider.generateAdventure).toHaveBeenCalledWith(mockWizardData, 'es', {
        phases: 3,
        puzzlesPerPhase: 2,
        screenFree: true,
      })
    })

    it('should generate adventure with text and image providers', async () => {
      const mockPack = createMockPack()
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const mockImageGen: IImageGenerator = {
        generateImage: vi.fn().mockResolvedValue({
          url: 'https://example.com/new-image.jpg',
          prompt: 'Una selva mágica',
        }),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        undefined, // No image searcher
        undefined, // No cache
        mockImageGen // Image generator
      )

      expect(result.ok).toBe(true)
      expect(result.pack).toBeDefined()

      // Verificar que se llamó al generador de imagen con el prompt correcto
      expect(mockImageGen.generateImage).toHaveBeenCalledWith('Una selva mágica')

      // Verificar que la imagen fue reemplazada
      expect(result.pack?.image.url).toBe('https://example.com/new-image.jpg')
      expect(result.pack?.image.prompt).toBe('Una selva mágica')
    })
  })

  describe('Resiliencia de imagen', () => {
    it('should use placeholder when image generation fails', async () => {
      const mockPack = createMockPack()
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const mockImageGen: IImageGenerator = {
        generateImage: vi.fn().mockRejectedValue(new Error('Image service unavailable')),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        undefined, // No image searcher
        undefined, // No cache
        mockImageGen // Image generator
      )

      expect(result.ok).toBe(true)
      expect(result.pack).toBeDefined()

      // Debería tener una imagen placeholder
      expect(result.pack?.image.url).toContain('placehold.co')

      // Debe mantener el prompt original
      expect(result.pack?.image.prompt).toBe('Una selva mágica')

      // Debe registrar warning
      expect(result.warnings).toBeDefined()
      expect(result.warnings?.length).toBeGreaterThan(0)
      expect(result.warnings?.some(w => w.includes('Generación de imagen falló'))).toBe(true)
    })

    it('should use provider image when no image generator provided', async () => {
      const mockPack = createMockPack()
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const result = await generateAdventureMultimodal(mockWizardData, mockProvider)

      expect(result.ok).toBe(true)
      expect(result.pack).toBeDefined()

      // Sin searcher ni generator, debe usar placeholder
      expect(result.pack?.image.url).toContain('placehold.co')

      // Debe registrar warning
      expect(result.warnings).toBeDefined()
      expect(result.warnings?.some(w => w.includes('No se pudo obtener imagen'))).toBe(true)
    })

    it('should add default placeholder when pack has no image', async () => {
      const mockPack = createMockPack()
      mockPack.image = null as any // Simular pack sin imagen

      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const result = await generateAdventureMultimodal(mockWizardData, mockProvider)

      expect(result.ok).toBe(true)
      expect(result.pack).toBeDefined()

      // Debería añadir placeholder por defecto
      expect(result.pack?.image).toBeDefined()
      expect(result.pack?.image.url).toContain('placehold.co')

      expect(result.warnings).toBeDefined()
      expect(result.warnings?.some(w => w.includes('No se pudo obtener imagen'))).toBe(true)
    })
  })

  describe('Manejo de errores', () => {
    it('should return error when adventure generation fails', async () => {
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockRejectedValue(new Error('Provider error')),
      }

      const result = await generateAdventureMultimodal(mockWizardData, mockProvider)

      expect(result.ok).toBe(false)
      expect(result.error).toContain('Provider error')
      expect(result.pack).toBeUndefined()
    })

    it('should handle unknown errors gracefully', async () => {
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockRejectedValue('String error'),
      }

      const result = await generateAdventureMultimodal(mockWizardData, mockProvider)

      expect(result.ok).toBe(false)
      expect(result.error).toContain('Error desconocido')
    })
  })

  describe('Compatibilidad con Supabase', () => {
    it('should return GeneratedAdventurePack structure compatible with Supabase', async () => {
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(createMockPack()),
      }

      const result = await generateAdventureMultimodal(mockWizardData, mockProvider)

      expect(result.ok).toBe(true)
      expect(result.pack).toBeDefined()

      const pack = result.pack!

      // Verificar todos los campos requeridos por Supabase
      expect(pack.id).toBeDefined()
      expect(pack.title).toBeDefined()
      expect(pack.image).toBeDefined()
      expect(pack.image.url).toBeDefined()
      expect(pack.image.prompt).toBeDefined()
      expect(pack.estimatedDurationMinutes).toBeDefined()
      expect(pack.ageRange).toBeDefined()
      expect(pack.participants).toBeDefined()
      expect(pack.difficulty).toBeDefined()
      expect(pack.tone).toBeDefined()
      expect(pack.adventureType).toBeDefined()
      expect(pack.place).toBeDefined()
      expect(pack.materials).toBeDefined()
      expect(pack.introduction).toBeDefined()
      expect(pack.missions).toBeDefined()
      expect(pack.conclusion).toBeDefined()
      expect(pack.createdAt).toBeDefined()
    })

    it('should always have valid image field for Supabase', async () => {
      const mockPack = createMockPack()
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const faultyImageGen: IImageGenerator = {
        generateImage: vi.fn().mockRejectedValue(new Error('Failed')),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        undefined, // No image searcher
        undefined, // No cache
        faultyImageGen // Faulty image generator
      )

      // Incluso con fallo de imagen, debe tener imagen válida
      expect(result.ok).toBe(true)
      expect(result.pack?.image).toBeDefined()
      expect(result.pack?.image.url).toBeTruthy()
      expect(result.pack?.image.prompt).toBeTruthy()
    })
  })

  describe('Integración de warnings', () => {
    it('should accumulate multiple warnings', async () => {
      const mockPack = createMockPack()
      mockPack.image = { url: '', prompt: '' } // Imagen vacía

      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const mockImageGen: IImageGenerator = {
        generateImage: vi.fn().mockRejectedValue(new Error('Image failed')),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        undefined, // No image searcher
        undefined, // No cache
        mockImageGen // Image generator
      )

      expect(result.ok).toBe(true)
      expect(result.warnings).toBeDefined()
      expect(result.warnings!.length).toBeGreaterThan(0)
    })

    it('should not include warnings when everything succeeds', async () => {
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(createMockPack()),
      }

      const mockImageGen: IImageGenerator = {
        generateImage: vi.fn().mockResolvedValue({
          url: 'https://example.com/success.jpg',
          prompt: 'Test',
        }),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        undefined, // No image searcher
        undefined, // No cache
        mockImageGen // Image generator
      )

      expect(result.ok).toBe(true)
      expect(result.warnings).toBeUndefined()
    })
  })

  describe('Integración con Image Searcher (Pexels)', () => {
    it('should use image searcher to fetch real image', async () => {
      const mockPack = createMockPack()
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const mockImageSearcher: IImageSearcher = {
        searchCoverImage: vi.fn().mockResolvedValue({
          url: 'https://images.pexels.com/photos/123/photo.jpg',
          prompt: 'adventure home exciting',
          attribution: {
            photographer: 'John Photographer',
            sourceUrl: 'https://pexels.com/photo/123',
          },
        }),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        mockImageSearcher
      )

      expect(result.ok).toBe(true)
      expect(result.pack).toBeDefined()

      // Verificar que se llamó al searcher
      expect(mockImageSearcher.searchCoverImage).toHaveBeenCalledTimes(1)

      // Verificar que la imagen fue reemplazada con la de Pexels
      expect(result.pack?.image.url).toBe('https://images.pexels.com/photos/123/photo.jpg')

      // Debe registrar atribución en warnings
      expect(result.warnings).toBeDefined()
      expect(result.warnings?.some((w) => w.includes('John Photographer'))).toBe(true)
    })

    it('should use cache when available', async () => {
      const mockPack = createMockPack()
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const mockImageSearcher: IImageSearcher = {
        searchCoverImage: vi.fn().mockResolvedValue({
          url: 'https://images.pexels.com/photos/456/photo.jpg',
          prompt: 'adventure home exciting',
          attribution: {
            photographer: 'Jane Doe',
            sourceUrl: 'https://pexels.com/photo/456',
          },
        }),
      }

      const mockCache: ImageCacheRepository = {
        get: vi.fn().mockResolvedValue({
          query: 'adventure home exciting',
          url: 'https://images.pexels.com/cached/789/photo.jpg',
          photographer: 'Cached Photographer',
          sourceUrl: 'https://pexels.com/photo/789',
          createdAt: new Date().toISOString(),
        }),
        set: vi.fn().mockResolvedValue(undefined),
        cleanExpired: vi.fn().mockResolvedValue(0),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        mockImageSearcher,
        mockCache
      )

      expect(result.ok).toBe(true)

      // Verificar que se consultó la caché
      expect(mockCache.get).toHaveBeenCalledTimes(1)

      // Verificar que NO se llamó al searcher (porque estaba en caché)
      expect(mockImageSearcher.searchCoverImage).not.toHaveBeenCalled()

      // Verificar que se usó la imagen de caché
      expect(result.pack?.image.url).toBe('https://images.pexels.com/cached/789/photo.jpg')

      // Verificar que NO se guardó en caché (ya estaba)
      expect(mockCache.set).not.toHaveBeenCalled()
    })

    it('should save to cache when searcher finds new image', async () => {
      const mockPack = createMockPack()
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const mockImageSearcher: IImageSearcher = {
        searchCoverImage: vi.fn().mockResolvedValue({
          url: 'https://images.pexels.com/photos/999/photo.jpg',
          prompt: 'adventure home exciting',
          attribution: {
            photographer: 'New Photographer',
            sourceUrl: 'https://pexels.com/photo/999',
          },
        }),
      }

      const mockCache: ImageCacheRepository = {
        get: vi.fn().mockResolvedValue(null), // No hay en caché
        set: vi.fn().mockResolvedValue(undefined),
        cleanExpired: vi.fn().mockResolvedValue(0),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        mockImageSearcher,
        mockCache
      )

      expect(result.ok).toBe(true)

      // Verificar que se consultó la caché
      expect(mockCache.get).toHaveBeenCalledTimes(1)

      // Verificar que se llamó al searcher (no estaba en caché)
      expect(mockImageSearcher.searchCoverImage).toHaveBeenCalledTimes(1)

      // Verificar que se guardó en caché el nuevo resultado
      expect(mockCache.set).toHaveBeenCalledTimes(1)
      expect(mockCache.set).toHaveBeenCalledWith({
        query: expect.any(String),
        url: 'https://images.pexels.com/photos/999/photo.jpg',
        photographer: 'New Photographer',
        sourceUrl: 'https://pexels.com/photo/999',
      })
    })

    it('should fallback to image searcher when generator fails', async () => {
      const mockPack = createMockPack()
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const mockImageSearcher: IImageSearcher = {
        searchCoverImage: vi.fn().mockResolvedValue({
          url: 'https://images.pexels.com/photos/fallback/123.jpg',
          prompt: 'adventure home exciting',
          attribution: {
            photographer: 'Fallback Photographer',
            sourceUrl: 'https://pexels.com/photo/123',
          },
        }),
      }

      const mockImageGen: IImageGenerator = {
        generateImage: vi.fn().mockRejectedValue(new Error('AI service unavailable')),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        mockImageSearcher,
        undefined,
        mockImageGen
      )

      expect(result.ok).toBe(true)

      // Verificar que se intentó generación primero
      expect(mockImageGen.generateImage).toHaveBeenCalledTimes(1)

      // Verificar que se usó el searcher como fallback
      expect(mockImageSearcher.searchCoverImage).toHaveBeenCalledTimes(1)

      // Verificar que la imagen es la de Pexels (fallback)
      expect(result.pack?.image.url).toBe('https://images.pexels.com/photos/fallback/123.jpg')

      // Debe tener warnings sobre el fallo y el fallback
      expect(result.warnings).toBeDefined()
      expect(result.warnings?.some((w) => w.includes('AI service unavailable'))).toBe(true)
      expect(result.warnings?.some((w) => w.includes('Pexels, usado como fallback'))).toBe(true)
    })

    it('should use placeholder when both searcher and generator fail', async () => {
      const mockPack = createMockPack()
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const mockImageSearcher: IImageSearcher = {
        searchCoverImage: vi.fn().mockResolvedValue(null),
      }

      const mockImageGen: IImageGenerator = {
        generateImage: vi.fn().mockRejectedValue(new Error('AI service down')),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        mockImageSearcher,
        undefined,
        mockImageGen
      )

      expect(result.ok).toBe(true)

      // Verificar que se intentó ambos métodos
      expect(mockImageSearcher.searchCoverImage).toHaveBeenCalledTimes(1)
      expect(mockImageGen.generateImage).toHaveBeenCalledTimes(1)

      // Verificar que se usó placeholder
      expect(result.pack?.image.url).toContain('placehold.co')

      // Debe tener warnings de ambos fallos
      expect(result.warnings).toBeDefined()
      expect(result.warnings!.length).toBeGreaterThan(1)
    })

    it('should handle searcher error gracefully', async () => {
      const mockPack = createMockPack()
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const mockImageSearcher: IImageSearcher = {
        searchCoverImage: vi.fn().mockRejectedValue(new Error('Network timeout')),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        mockImageSearcher
      )

      expect(result.ok).toBe(true)
      expect(result.pack).toBeDefined()

      // Debe continuar el flujo y usar placeholder
      expect(result.pack?.image.url).toContain('placehold.co')

      // Debe registrar warning del error
      expect(result.warnings).toBeDefined()
      expect(result.warnings?.some((w) => w.includes('Network timeout'))).toBe(true)
    })

    it('should prioritize generator over searcher when both provided', async () => {
      const mockPack = createMockPack()
      const mockProvider: IAdventureProvider = {
        generateAdventure: vi.fn().mockResolvedValue(mockPack),
      }

      const mockImageSearcher: IImageSearcher = {
        searchCoverImage: vi.fn().mockResolvedValue({
          url: 'https://images.pexels.com/should-not-be-used/123.jpg',
          prompt: 'adventure home exciting',
        }),
      }

      const mockImageGen: IImageGenerator = {
        generateImage: vi.fn().mockResolvedValue({
          url: 'https://example.com/ai-priority.jpg',
          prompt: 'Una selva mágica',
        }),
      }

      const result = await generateAdventureMultimodal(
        mockWizardData,
        mockProvider,
        mockImageSearcher,
        undefined,
        mockImageGen
      )

      expect(result.ok).toBe(true)

      // Verificar que se usó el generador primero
      expect(mockImageGen.generateImage).toHaveBeenCalledTimes(1)

      // Verificar que NO se llamó al searcher (generador tuvo éxito)
      expect(mockImageSearcher.searchCoverImage).not.toHaveBeenCalled()

      // Verificar que se usó la imagen generada por IA
      expect(result.pack?.image.url).toBe('https://example.com/ai-priority.jpg')
    })
  })
})
