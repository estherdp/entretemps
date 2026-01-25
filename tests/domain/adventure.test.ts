import { describe, it, expect } from 'vitest'
import type { Adventure, Challenge, WizardData, Difficulty } from '@/domain/adventure'

describe('Adventure types', () => {
  it('should create a valid WizardData object', () => {
    const wizardData: WizardData = {
      theme: 'piratas',
      childrenAges: [6, 8, 10],
      duration: 60,
      availableMaterials: ['cartulina', 'tijeras', 'rotuladores'],
      difficulty: 'medium',
      numberOfChallenges: 4,
    }

    expect(wizardData.theme).toBe('piratas')
    expect(wizardData.childrenAges).toHaveLength(3)
    expect(wizardData.difficulty).toBe('medium')
  })

  it('should create a valid Challenge object', () => {
    const challenge: Challenge = {
      id: 'challenge-1',
      order: 1,
      title: 'El mapa del tesoro',
      description: 'Encuentra las pistas escondidas en el mapa',
      solution: 'Las pistas forman una X en el jardín',
      hints: ['Mira las esquinas', 'Une los puntos rojos'],
      materials: ['mapa impreso', 'rotulador rojo'],
    }

    expect(challenge.id).toBe('challenge-1')
    expect(challenge.hints).toHaveLength(2)
    expect(challenge.materials).toContain('mapa impreso')
  })

  it('should validate Difficulty type values', () => {
    const validDifficulties: Difficulty[] = ['easy', 'medium', 'hard']

    validDifficulties.forEach(difficulty => {
      expect(['easy', 'medium', 'hard']).toContain(difficulty)
    })
  })
})
