// src/lib/schemas/generate-pack-request.schema.ts

import { z } from 'zod'

const occasionSchema = z.enum(['birthday', 'family-afternoon', 'party', 'excursion'])
const placeSchema = z.enum(['home', 'garden', 'park', 'indoor', 'outdoor'])
const adventureTypeSchema = z.enum(['mystery', 'adventure', 'fantasy', 'action', 'humor'])
const toneSchema = z.enum(['funny', 'enigmatic', 'exciting', 'calm'])
const difficultySchema = z.enum(['easy', 'medium', 'hard'])

const wizardDataSchema = z.object({
  occasion: occasionSchema.optional(),
  ages: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
  kidsCount: z.number().optional(),
  interests: z.string().optional(),
  place: placeSchema.optional(),
  adventureType: adventureTypeSchema.optional(),
  tone: toneSchema.optional(),
  difficulty: difficultySchema.optional(),
})

const constraintsSchema = z.object({
  phases: z.number(),
  puzzlesPerPhase: z.number(),
  screenFree: z.boolean(),
})

export const generatePackRequestSchema = z.object({
  locale: z.string(),
  wizardData: wizardDataSchema,
  constraints: constraintsSchema,
})

export type GeneratePackRequestSchema = z.infer<typeof generatePackRequestSchema>
