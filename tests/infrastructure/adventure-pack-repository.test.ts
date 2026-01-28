import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import * as supabaseClient from '@/infrastructure/supabase/supabase-client'
import { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

vi.mock('@/infrastructure/supabase/supabase-client', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

const mockPack: GeneratedAdventurePack = {
  id: 'pack-123',
  title: 'Test Adventure',
  image: { url: 'https://example.com/image.jpg', prompt: 'test' },
  estimatedDurationMinutes: 60,
  ageRange: { min: 5, max: 10 },
  participants: 4,
  difficulty: 'easy',
  tone: 'funny',
  adventureType: 'mystery',
  place: 'home',
  materials: ['paper', 'pencil'],
  introduction: {
    story: 'Test story',
    setupForParents: 'Setup guide',
  },
  missions: [
    {
      order: 1,
      title: 'Mission 1',
      story: 'Mission story',
      parentGuide: 'Parent guide',
      successCondition: 'Success condition',
    },
  ],
  conclusion: {
    story: 'Conclusion story',
    celebrationTip: 'Celebration tip',
  },
  createdAt: '2024-01-01T00:00:00Z',
}

describe('AdventurePackRepository', () => {
  let repository: AdventurePackRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repository = new AdventurePackRepository()
  })

  describe('save', () => {
    it('should save pack and return saved data', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: 'saved-123',
              user_id: 'user-123',
              title: 'Test Adventure',
              pack: mockPack,
              created_at: '2024-01-01T00:00:00Z',
            },
            error: null,
          }),
        }),
      })

      const mockFrom = vi.spyOn(supabaseClient.supabase, 'from')
      mockFrom.mockReturnValue({
        insert: mockInsert,
      } as never)

      const result = await repository.save({
        userId: 'user-123',
        title: 'Test Adventure',
        pack: mockPack,
      })

      expect(mockFrom).toHaveBeenCalledWith('adventure_packs')
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        title: 'Test Adventure',
        pack: mockPack,
      })
      expect(result).toEqual({
        id: 'saved-123',
        userId: 'user-123',
        title: 'Test Adventure',
        pack: mockPack,
        createdAt: '2024-01-01T00:00:00Z',
      })
    })

    it('should throw error when save fails', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Insert failed' },
          }),
        }),
      })

      const mockFrom = vi.spyOn(supabaseClient.supabase, 'from')
      mockFrom.mockReturnValue({
        insert: mockInsert,
      } as never)

      await expect(
        repository.save({
          userId: 'user-123',
          title: 'Test Adventure',
          pack: mockPack,
        })
      ).rejects.toThrow('Error al guardar el pack')
    })
  })

  describe('listByUserId', () => {
    it('should return list of packs for user', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: [
          {
            id: 'pack-1',
            user_id: 'user-123',
            title: 'Pack 1',
            pack: mockPack,
            created_at: '2024-01-01T00:00:00Z',
          },
          {
            id: 'pack-2',
            user_id: 'user-123',
            title: 'Pack 2',
            pack: mockPack,
            created_at: '2024-01-02T00:00:00Z',
          },
        ],
        error: null,
      })

      const mockEq = vi.fn().mockReturnValue({
        order: mockOrder,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      })

      const mockFrom = vi.spyOn(supabaseClient.supabase, 'from')
      mockFrom.mockReturnValue({
        select: mockSelect,
      } as never)

      const result = await repository.listByUserId('user-123')

      expect(mockFrom).toHaveBeenCalledWith('adventure_packs')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123')
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('pack-1')
      expect(result[1].id).toBe('pack-2')
    })

    it('should throw error when list fails', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Query failed' },
      })

      const mockEq = vi.fn().mockReturnValue({
        order: mockOrder,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      })

      const mockFrom = vi.spyOn(supabaseClient.supabase, 'from')
      mockFrom.mockReturnValue({
        select: mockSelect,
      } as never)

      await expect(repository.listByUserId('user-123')).rejects.toThrow(
        'Error al listar los packs'
      )
    })
  })

  describe('getById', () => {
    it('should return pack when found', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: {
          id: 'pack-123',
          user_id: 'user-123',
          title: 'Test Pack',
          pack: mockPack,
          created_at: '2024-01-01T00:00:00Z',
        },
        error: null,
      })

      const mockEq = vi.fn().mockReturnValue({
        single: mockSingle,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      })

      const mockFrom = vi.spyOn(supabaseClient.supabase, 'from')
      mockFrom.mockReturnValue({
        select: mockSelect,
      } as never)

      const result = await repository.getById('pack-123')

      expect(mockFrom).toHaveBeenCalledWith('adventure_packs')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', 'pack-123')
      expect(result).toEqual({
        id: 'pack-123',
        userId: 'user-123',
        title: 'Test Pack',
        pack: mockPack,
        createdAt: '2024-01-01T00:00:00Z',
      })
    })

    it('should return null when pack not found', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      })

      const mockEq = vi.fn().mockReturnValue({
        single: mockSingle,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      })

      const mockFrom = vi.spyOn(supabaseClient.supabase, 'from')
      mockFrom.mockReturnValue({
        select: mockSelect,
      } as never)

      const result = await repository.getById('nonexistent')

      expect(result).toBeNull()
    })

    it('should throw error when query fails', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Query error' },
      })

      const mockEq = vi.fn().mockReturnValue({
        single: mockSingle,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      })

      const mockFrom = vi.spyOn(supabaseClient.supabase, 'from')
      mockFrom.mockReturnValue({
        select: mockSelect,
      } as never)

      await expect(repository.getById('pack-123')).rejects.toThrow(
        'Error al obtener el pack'
      )
    })
  })
})
