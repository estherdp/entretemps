// src/lib/schemas/ai-adventure-output.schema.ts

import { z } from 'zod'
import {
  generatedAdventurePackConclusionSchema,
  generatedAdventurePackIntroductionSchema,
  generatedAdventurePackNarratorSchema,
  missionAgeAdaptationsSchema,
  missionChallengeSchema,
  missionClueCardSchema,
} from './generated-adventure-pack.schema'

/**
 * Contrato de salida que se exige a CUALQUIER modelo de IA.
 *
 * A diferencia del schema persistido, aquí los campos jugables son
 * obligatorios: queremos que toda aventura nueva los traiga. Tampoco
 * incluye id, createdAt ni imagen, que no son responsabilidad del modelo.
 *
 * Es agnóstico del proveedor: cada adaptador lo convierte al formato de
 * salida estructurada que soporte (JSON Schema en Gemini, OpenAI, etc.).
 */
export const aiMissionOutputSchema = z.object({
  order: z.number().int().positive(),
  title: z.string(),
  story: z.string(),
  parentGuide: z.string(),
  successCondition: z.string(),
  challenge: missionChallengeSchema,
  hints: z.array(z.string()).min(1).max(3),
  clueCards: z.array(missionClueCardSchema).min(1).max(3),
  materials: z.array(z.string()),
  ageAdaptations: missionAgeAdaptationsSchema,
  estimatedMinutes: z.number().int().positive(),
})

export const aiAdventureOutputSchema = z.object({
  title: z.string(),
  narrator: generatedAdventurePackNarratorSchema,
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
  missions: z.array(aiMissionOutputSchema).min(1),
  conclusion: generatedAdventurePackConclusionSchema,
})

export type AIAdventureOutput = z.infer<typeof aiAdventureOutputSchema>
export type AIMissionOutput = z.infer<typeof aiMissionOutputSchema>
