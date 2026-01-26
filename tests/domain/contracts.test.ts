import { describe, it, expect } from 'vitest'
import { generatePackRequestSchema } from '@/lib/schemas/generate-pack-request.schema'
import { adventurePackSchema } from '@/lib/schemas/adventure-pack.schema'

describe('GeneratePackRequest schema', () => {
  it('should validate a correct request', () => {
    const validRequest = {
      locale: 'es',
      wizardData: {
        occasion: 'birthday',
        ages: { min: 6, max: 10 },
        kidsCount: 8,
        interests: 'Dinosaurios, Superhéroes',
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

    expect(generatePackRequestSchema.safeParse(validRequest).success).toBe(true)
  })

  it('should reject a request without wizardData', () => {
    const invalidRequest = {
      locale: 'es',
      constraints: {
        phases: 3,
        puzzlesPerPhase: 2,
        screenFree: true,
      },
    }

    expect(generatePackRequestSchema.safeParse(invalidRequest).success).toBe(false)
  })
})

describe('AdventurePack schema', () => {
  const createValidPuzzle = (index: 1 | 2) => ({
    index,
    type: 'riddle',
    statement: 'Enigma de prueba',
    solution: 'Solución',
    hints: ['Pista 1', 'Pista 2'],
  })

  const createValidPhase = (index: 1 | 2 | 3) => ({
    index,
    title: `Fase ${index}`,
    objective: 'Objetivo de la fase',
    puzzles: [createValidPuzzle(1), createValidPuzzle(2)],
  })

  it('should validate a correct pack', () => {
    const validPack = {
      meta: {
        title: 'La aventura del tesoro perdido',
        createdAt: '2024-01-15T10:30:00.000Z',
      },
      story: {
        synopsis: 'Una emocionante aventura en busca del tesoro.',
        setting: 'Un castillo medieval misterioso.',
      },
      characters: [
        { name: 'Capitán Barbanegra', role: 'antagonist', description: 'El temible pirata.' },
      ],
      phases: [createValidPhase(1), createValidPhase(2), createValidPhase(3)],
      setupGuide: {
        steps: ['Preparar el espacio', 'Esconder las pistas'],
        materials: ['Papel', 'Tijeras', 'Cinta adhesiva'],
      },
      printables: [
        { title: 'Mapa del tesoro', content: 'Contenido del mapa...' },
      ],
    }

    expect(adventurePackSchema.safeParse(validPack).success).toBe(true)
  })

  it('should reject a pack with incorrect number of phases', () => {
    const invalidPack = {
      meta: {
        title: 'La aventura del tesoro perdido',
        createdAt: '2024-01-15T10:30:00.000Z',
      },
      story: {
        synopsis: 'Una emocionante aventura.',
        setting: 'Un castillo.',
      },
      characters: [],
      phases: [createValidPhase(1), createValidPhase(2)], // Solo 2 fases
      setupGuide: {
        steps: [],
        materials: [],
      },
      printables: [],
    }

    expect(adventurePackSchema.safeParse(invalidPack).success).toBe(false)
  })
})
