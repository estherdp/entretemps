// src/lib/schemas/generated-adventure-pack.schema.ts

import { z } from 'zod'

const generatedAdventurePackImageSchema = z.object({
  url: z.string().url(),
  prompt: z.string(),
})

export const generatedAdventurePackIntroductionSchema = z.object({
  story: z.string(),
  setupForParents: z.string(),
})

export const generatedAdventurePackNarratorSchema = z.object({
  name: z.string(),
  description: z.string(),
})

export const missionChallengeSchema = z.object({
  type: z.enum(['riddle', 'puzzle', 'search', 'physical', 'creative', 'cipher']),
  description: z.string(),
  solution: z.string(),
})

export const missionClueCardSchema = z.object({
  text: z.string(),
  hidingSpot: z.string(),
})

export const missionAgeAdaptationsSchema = z.object({
  younger: z.string(),
  older: z.string(),
})

/**
 * Misión tal y como se persiste. Los campos jugables son opcionales
 * para aceptar packs y plantillas creados antes de existir.
 */
export const generatedAdventurePackMissionSchema = z.object({
  order: z.number().int().positive(),
  title: z.string(),
  story: z.string(),
  parentGuide: z.string(),
  successCondition: z.string(),
  challenge: missionChallengeSchema.optional(),
  hints: z.array(z.string()).optional(),
  clueCards: z.array(missionClueCardSchema).optional(),
  materials: z.array(z.string()).optional(),
  ageAdaptations: missionAgeAdaptationsSchema.optional(),
  estimatedMinutes: z.number().int().positive().optional(),
})

export const generatedAdventurePackConclusionSchema = z.object({
  story: z.string(),
  celebrationTip: z.string(),
})

export const generatedAdventurePackSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  image: generatedAdventurePackImageSchema.optional(),
  narrator: generatedAdventurePackNarratorSchema.optional(),
  estimatedDurationMinutes: z.number().int().positive(),
  ageRange: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
  }),
  participants: z.number().int().positive(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tone: z.enum(['funny', 'enigmatic', 'exciting', 'calm']),
  adventureType: z.enum(['mystery', 'adventure', 'fantasy', 'action', 'humor']),
  place: z.enum(['home', 'garden', 'park', 'indoor', 'outdoor']),
  materials: z.array(z.string()),
  introduction: generatedAdventurePackIntroductionSchema,
  missions: z.array(generatedAdventurePackMissionSchema).min(1),
  conclusion: generatedAdventurePackConclusionSchema,
  createdAt: z.string().datetime(),
})

export type GeneratedAdventurePackSchema = z.infer<typeof generatedAdventurePackSchema>
