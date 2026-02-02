// tests/application/regenerate-mission.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { regenerateMission } from '@/application/regenerate-mission'
import type { IMissionEditor, AdventureContext } from '@/domain/services'
import type { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import type { SavedAdventurePack } from '@/domain/saved-adventure-pack'
import type { GeneratedAdventurePack, GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'

describe('regenerateMission', () => {
  let mockPack: GeneratedAdventurePack
  let savedPack: SavedAdventurePack
  let mockRepository: AdventurePackRepository
  let mockMissionEditor: IMissionEditor

  beforeEach(() => {
    mockPack = {
      id: 'pack-123',
      title: 'La Aventura del Tesoro Perdido',
      image: { url: 'https://example.com/image.jpg', prompt: 'treasure map' },
      estimatedDurationMinutes: 60,
      ageRange: { min: 6, max: 10 },
      participants: 5,
      difficulty: 'medium',
      tone: 'exciting',
      adventureType: 'adventure',
      place: 'home',
      materials: ['Mapa', 'Brújula', 'Lápiz'],
      introduction: {
        story: 'Historia de introducción',
        setupForParents: 'Preparación para padres',
      },
      missions: [
        {
          order: 1,
          title: 'Encuentra el mapa',
          story: 'Historia de la misión 1',
          parentGuide: 'Guía para padres 1',
          successCondition: 'Encontrar el mapa escondido',
        },
        {
          order: 2,
          title: 'Descifra las pistas',
          story: 'Historia de la misión 2',
          parentGuide: 'Guía para padres 2',
          successCondition: 'Resolver el acertijo',
        },
        {
          order: 3,
          title: 'Encuentra el tesoro',
          story: 'Historia de la misión 3',
          parentGuide: 'Guía para padres 3',
          successCondition: 'Descubrir el tesoro',
        },
      ],
      conclusion: {
        story: 'Historia de conclusión',
        celebrationTip: 'Celebrar con una fiesta',
      },
      createdAt: '2024-01-01T00:00:00Z',
    }

    savedPack = {
      id: 'saved-123',
      userId: 'user-456',
      title: 'La Aventura del Tesoro Perdido',
      pack: mockPack,
      createdAt: '2024-01-01T00:00:00Z',
    }

    mockRepository = {
      getById: vi.fn().mockResolvedValue(savedPack),
      updatePackJson: vi.fn().mockResolvedValue(savedPack),
    } as unknown as AdventurePackRepository

    mockMissionEditor = {
      regenerateSingleMission: vi.fn(),
    } as unknown as IMissionEditor
  })

  it('should regenerate a mission successfully', async () => {
    const regeneratedMission: GeneratedAdventurePackMission = {
      order: 2,
      title: 'Descifra las pistas (Mejorada)',
      story: 'Nueva historia de la misión 2 mejorada',
      parentGuide: 'Nueva guía para padres 2',
      successCondition: 'Resolver el acertijo mejorado',
    }

    vi.mocked(mockMissionEditor.regenerateSingleMission).mockResolvedValue(regeneratedMission)

    const result = await regenerateMission(
      'saved-123',
      'user-456',
      2,
      undefined,
      mockMissionEditor,
      mockRepository,
      'es'
    )

    // Verificar que se llamó al editor de misiones con el contexto correcto
    expect(mockMissionEditor.regenerateSingleMission).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'La Aventura del Tesoro Perdido',
        ageRange: { min: 6, max: 10 },
        adventureType: 'adventure',
        tone: 'exciting',
        place: 'home',
        difficulty: 'medium',
        existingMissions: expect.arrayContaining([
          expect.objectContaining({ order: 1 }),
          expect.objectContaining({ order: 3 }),
        ]),
      }),
      mockPack.missions[1], // Misión 2 (índice 1)
      undefined,
      'es'
    )

    // Verificar que se guardó en el repositorio
    expect(mockRepository.updatePackJson).toHaveBeenCalledWith(
      'saved-123',
      expect.objectContaining({
        missions: expect.arrayContaining([
          mockPack.missions[0], // Misión 1 sin cambios
          regeneratedMission, // Misión 2 regenerada
          mockPack.missions[2], // Misión 3 sin cambios
        ]),
      })
    )

    // Verificar el resultado
    expect(result).toEqual(regeneratedMission)
  })

  it('should regenerate a mission with feedback', async () => {
    const regeneratedMission: GeneratedAdventurePackMission = {
      order: 1,
      title: 'Encuentra el mapa (Más divertida)',
      story: 'Nueva historia con más humor',
      parentGuide: 'Nueva guía',
      successCondition: 'Encontrar el mapa',
    }

    vi.mocked(mockMissionEditor.regenerateSingleMission).mockResolvedValue(regeneratedMission)

    const feedback = 'Hazla más divertida y con más humor'

    await regenerateMission(
      'saved-123',
      'user-456',
      1,
      feedback,
      mockMissionEditor,
      mockRepository,
      'es'
    )

    // Verificar que se pasó el feedback
    expect(mockMissionEditor.regenerateSingleMission).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object),
      feedback,
      'es'
    )
  })

  it('should throw error if pack not found', async () => {
    vi.mocked(mockRepository.getById).mockResolvedValue(null)

    await expect(
      regenerateMission(
        'saved-123',
        'user-456',
        1,
        undefined,
        mockMissionEditor,
        mockRepository
      )
    ).rejects.toThrow('Pack no encontrado')
  })

  it('should throw error if user does not own the pack', async () => {
    const packOwnedByOtherUser = {
      ...savedPack,
      userId: 'different-user',
    }

    vi.mocked(mockRepository.getById).mockResolvedValue(packOwnedByOtherUser)

    await expect(
      regenerateMission(
        'saved-123',
        'user-456',
        1,
        undefined,
        mockMissionEditor,
        mockRepository
      )
    ).rejects.toThrow('No tienes permiso para editar este pack')
  })

  it('should throw error if mission not found', async () => {
    await expect(
      regenerateMission(
        'saved-123',
        'user-456',
        99, // Orden de misión que no existe
        undefined,
        mockMissionEditor,
        mockRepository
      )
    ).rejects.toThrow('Misión 99 no encontrada en el pack')
  })

  it('should include other missions in context for coherence', async () => {
    const regeneratedMission: GeneratedAdventurePackMission = {
      order: 2,
      title: 'Nueva misión 2',
      story: 'Nueva historia',
      parentGuide: 'Nueva guía',
      successCondition: 'Nuevo criterio',
    }

    vi.mocked(mockMissionEditor.regenerateSingleMission).mockResolvedValue(regeneratedMission)

    await regenerateMission(
      'saved-123',
      'user-456',
      2,
      undefined,
      mockMissionEditor,
      mockRepository
    )

    // Verificar que el contexto incluye las otras misiones (1 y 3)
    const callArgs = vi.mocked(mockMissionEditor.regenerateSingleMission).mock.calls[0]
    const context = callArgs[0] as AdventureContext

    expect(context.existingMissions).toHaveLength(2)
    expect(context.existingMissions?.map((m) => m.order)).toEqual([1, 3])
    expect(context.existingMissions?.find((m) => m.order === 2)).toBeUndefined()
  })
})
