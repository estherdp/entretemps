export interface Adventure {
  id: string
  title: string
  theme: string
  targetAges: number[]
  duration: number
  difficulty: Difficulty
  challenges: Challenge[]
  narrative: Narrative
  createdAt: Date
}

export interface Challenge {
  id: string
  order: number
  title: string
  description: string
  solution: string
  hints: string[]
  materials: string[]
}

export interface Narrative {
  introduction: string
  conclusion: string
  transitions: string[]
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface WizardData {
  theme: string
  childrenAges: number[]
  duration: number
  availableMaterials: string[]
  difficulty: Difficulty
  numberOfChallenges: number
}
