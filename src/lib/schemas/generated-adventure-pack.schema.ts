// src/lib/schemas/generated-adventure-pack.schema.ts

import { z } from 'zod'

const generatedAdventurePackImageSchema = z.object({
  url: z.string().url(),
  prompt: z.string(),
})

const generatedAdventurePackIntroductionSchema = z.object({
  story: z.string(),
  setupForParents: z.string(),
})

const generatedAdventurePackMissionSchema = z.object({
  order: z.number().int().positive(),
  title: z.string(),
  story: z.string(),
  parentGuide: z.string(),
  successCondition: z.string(),
})

const generatedAdventurePackConclusionSchema = z.object({
  story: z.string(),
  celebrationTip: z.string(),
})

export const generatedAdventurePackSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  image: generatedAdventurePackImageSchema,
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
