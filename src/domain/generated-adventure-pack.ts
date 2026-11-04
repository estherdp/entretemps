// src/domain/generated-adventure-pack.ts

export interface GeneratedAdventurePackImage {
  url: string
  prompt: string
}

export interface GeneratedAdventurePackIntroduction {
  story: string
  setupForParents: string
}

/**
 * Personaje que narra la aventura y da continuidad a todas las misiones.
 */
export interface GeneratedAdventurePackNarrator {
  name: string
  description: string
}

export type MissionChallengeType = 'riddle' | 'puzzle' | 'search' | 'physical' | 'creative' | 'cipher'

/**
 * Reto concreto que los niños deben resolver en la misión.
 */
export interface MissionChallenge {
  type: MissionChallengeType
  description: string
  solution: string
}

/**
 * Tarjeta de pista imprimible: el texto que leen los niños
 * y dónde la esconde el adulto.
 */
export interface MissionClueCard {
  text: string
  hidingSpot: string
}

/**
 * Ajustes de la misión según la edad de los participantes.
 */
export interface MissionAgeAdaptations {
  younger: string
  older: string
}

export interface GeneratedAdventurePackMission {
  order: number
  title: string
  story: string
  parentGuide: string
  successCondition: string
  // Campos jugables. Opcionales para mantener compatibilidad
  // con packs guardados y plantillas anteriores.
  challenge?: MissionChallenge
  hints?: string[]
  clueCards?: MissionClueCard[]
  materials?: string[]
  ageAdaptations?: MissionAgeAdaptations
  estimatedMinutes?: number
}

export interface GeneratedAdventurePackConclusion {
  story: string
  celebrationTip: string
}

export interface GeneratedAdventurePack {
  id: string
  title: string
  // Opcional: la portada solo existe si hay un proveedor de imágenes activo.
  image?: GeneratedAdventurePackImage
  narrator?: GeneratedAdventurePackNarrator
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
