// src/domain/generated-adventure-pack.ts

export interface GeneratedAdventurePackImage {
  url: string
  prompt: string
}

export interface GeneratedAdventurePackIntroduction {
  story: string
  setupForParents: string
}

export interface GeneratedAdventurePackMission {
  order: number
  title: string
  story: string
  parentGuide: string
  successCondition: string
}

export interface GeneratedAdventurePackConclusion {
  story: string
  celebrationTip: string
}

export interface GeneratedAdventurePack {
  id: string
  title: string
  image: GeneratedAdventurePackImage
  estimatedDurationMinutes: number
  ageRange: { min: number; max: number }
  participants: number
  difficulty: 'easy' | 'medium' | 'hard'
  tone: 'funny' | 'enigmatic' | 'exciting' | 'calm'
  adventureType: 'mystery' | 'adventure' | 'fantasy' | 'action' | 'humor'
  place: 'home' | 'garden' | 'park' | 'indoor' | 'outdoor'
  materials: string[]
  introduction: GeneratedAdventurePackIntroduction
  missions: GeneratedAdventurePackMission[]
  conclusion: GeneratedAdventurePackConclusion
  createdAt: string
}
