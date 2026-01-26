// src/domain/wizard-data.ts

export type Occasion = 'birthday' | 'family-afternoon' | 'party' | 'excursion'
export type Place = 'home' | 'garden' | 'park' | 'indoor' | 'outdoor'

export type AdventureType = 'mystery' | 'adventure' | 'fantasy' | 'action' | 'humor'
export type Tone = 'funny' | 'enigmatic' | 'exciting' | 'calm'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface WizardData {
  occasion?: Occasion
  ages?: { min: number; max: number }
  kidsCount?: number
  interests?: string
  place?: Place
  adventureType?: AdventureType
  tone?: Tone
  difficulty?: Difficulty
}
