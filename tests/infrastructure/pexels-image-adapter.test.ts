// tests/infrastructure/pexels-image-adapter.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { PexelsImageAdapter } from '@/infrastructure/images/pexels-image.adapter'

// Mock de respuesta exitosa de Pexels API
const mockPexelsSuccessResponse = {
  photos: [
    {
      id: 1234567,
      width: 4000,
      height: 3000,
      url: 'https://www.pexels.com/photo/test-photo-1234567/',
      photographer: 'John Doe',
      photographer_url: 'https://www.pexels.com/@john-doe',
      photographer_id: 12345,
      src: {
        original: 'https://images.pexels.com/photos/1234567/photo.jpg',
        large2x: 'https://images.pexels.com/photos/1234567/photo-large2x.jpg',
        large: 'https://images.pexels.com/photos/1234567/photo-large.jpg',
        medium: 'https://images.pexels.com/photos/1234567/photo-medium.jpg',
        small: 'https://images.pexels.com/photos/1234567/photo-small.jpg',
        portrait: 'https://images.pexels.com/photos/1234567/photo-portrait.jpg',
        landscape: 'https://images.pexels.com/photos/1234567/photo-landscape.jpg',
        tiny: 'https://images.pexels.com/photos/1234567/photo-tiny.jpg',
      },
      alt: 'A beautiful landscape with mountains',
    },
  ],
  total_results: 1,
  page: 1,
  per_page: 1,
}

// Mock de respuesta sin resultados
const mockPexelsEmptyResponse = {
  photos: [],
  total_results: 0,
  page: 1,
  per_page: 1,
}

describe('PexelsImageAdapter - Unit Tests', () => {
  let adapter: PexelsImageAdapter
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock de fetch global
    fetchMock = vi.fn()
    global.fetch = fetchMock

    // Crear adapter con API key de prueba
    adapter = new PexelsImageAdapter('test-pexels-api-key')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Constructor', () => {
    it('should create adapter with provided API key', () => {
      const testAdapter = new PexelsImageAdapter('my-api-key')
      expect(testAdapter).toBeDefined()
    })

    it('should warn if API key is not provided', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      new PexelsImageAdapter(undefined)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('PEXELS_API_KEY not configured')
      )
      consoleSpy.mockRestore()
    })

    it('should read API key from process.env if not provided', () => {
      process.env.PEXELS_API_KEY = 'env-api-key'
      const testAdapter = new PexelsImageAdapter()
      expect(testAdapter).toBeDefined()
      delete process.env.PEXELS_API_KEY
    })
  })

  describe('searchCoverImage - Success Cases', () => {
    it('should return image result when search is successful', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPexelsSuccessResponse,
      })

      const result = await adapter.searchCoverImage('mountain landscape')

      expect(result).toBeDefined()
      expect(result?.url).toBe(mockPexelsSuccessResponse.photos[0].src.large)
      expect(result?.prompt).toBe('mountain landscape')
      expect(result?.attribution?.photographer).toBe('John Doe')
      expect(result?.attribution?.sourceUrl).toBe(
        'https://www.pexels.com/photo/test-photo-1234567/'
      )
    })

    it('should call Pexels API with correct parameters', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPexelsSuccessResponse,
      })

      await adapter.searchCoverImage('children adventure')

      expect(fetchMock).toHaveBeenCalledTimes(1)

      const callUrl = fetchMock.mock.calls[0][0]
      expect(callUrl).toContain('https://api.pexels.com/v1/search')
      expect(callUrl).toContain('query=children+adventure')
      expect(callUrl).toContain('per_page=1')
      expect(callUrl).toContain('orientation=landscape')

      const callOptions = fetchMock.mock.calls[0][1]
      expect(callOptions.method).toBe('GET')
      expect(callOptions.headers.Authorization).toBe('test-pexels-api-key')
    })

    it('should prefer large image size', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPexelsSuccessResponse,
      })

      const result = await adapter.searchCoverImage('nature')

      expect(result?.url).toBe(mockPexelsSuccessResponse.photos[0].src.large)
    })

    it('should fallback to landscape if large is not available', async () => {
      const responseWithoutLarge = {
        ...mockPexelsSuccessResponse,
        photos: [
          {
            ...mockPexelsSuccessResponse.photos[0],
            src: {
              ...mockPexelsSuccessResponse.photos[0].src,
              large: undefined,
            },
          },
        ],
      }

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => responseWithoutLarge,
      })

      const result = await adapter.searchCoverImage('test')

      expect(result?.url).toBe(responseWithoutLarge.photos[0].src.landscape)
    })

    it('should trim query string', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPexelsSuccessResponse,
      })

      await adapter.searchCoverImage('  spaced query  ')

      const callUrl = fetchMock.mock.calls[0][0]
      expect(callUrl).toContain('query=spaced+query')
    })
  })

  describe('searchCoverImage - Error Cases', () => {
    it('should return null if API key is not configured', async () => {
      const adapterNoKey = new PexelsImageAdapter('')

      const result = await adapterNoKey.searchCoverImage('test')

      expect(result).toBeNull()
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should return null if query is empty', async () => {
      const result = await adapter.searchCoverImage('')

      expect(result).toBeNull()
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should return null if query is only whitespace', async () => {
      const result = await adapter.searchCoverImage('   ')

      expect(result).toBeNull()
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('should return null if API response is not ok', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      })

      const result = await adapter.searchCoverImage('test')

      expect(result).toBeNull()
    })

    it('should return null if no photos found', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPexelsEmptyResponse,
      })

      const result = await adapter.searchCoverImage('nonexistent query')

      expect(result).toBeNull()
    })

    it('should return null if photos array is empty', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ...mockPexelsSuccessResponse, photos: [] }),
      })

      const result = await adapter.searchCoverImage('test')

      expect(result).toBeNull()
    })

    it('should return null if fetch throws error', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'))

      const result = await adapter.searchCoverImage('test')

      expect(result).toBeNull()
    })

    it('should return null if JSON parsing fails', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      const result = await adapter.searchCoverImage('test')

      expect(result).toBeNull()
    })
  })

  describe('Logging', () => {
    it('should log search query', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPexelsSuccessResponse,
      })

      await adapter.searchCoverImage('test query')

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Searching for: "test query"')
      )

      consoleSpy.mockRestore()
    })

    it('should log successful image found', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPexelsSuccessResponse,
      })

      await adapter.searchCoverImage('test')

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Found image by John Doe')
      )

      consoleSpy.mockRestore()
    })

    it('should log warning when no images found', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockPexelsEmptyResponse,
      })

      await adapter.searchCoverImage('nonexistent')

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('No images found for query')
      )

      consoleSpy.mockRestore()
    })

    it('should log error on API failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await adapter.searchCoverImage('test')

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('API error: 500')
      )

      consoleSpy.mockRestore()
    })
  })
})
