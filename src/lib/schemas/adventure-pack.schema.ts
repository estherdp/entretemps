// src/lib/schemas/adventure-pack.schema.ts

import { z } from 'zod'

const metaSchema = z.object({
  title: z.string(),
  createdAt: z.string().datetime(),
})

const storySchema = z.object({
  synopsis: z.string(),
  setting: z.string(),
})

const characterSchema = z.object({
  name: z.string(),
  role: z.string(),
  description: z.string(),
})

const puzzleSchema = z.object({
  index: z.union([z.literal(1), z.literal(2)]),
  type: z.string(),
  statement: z.string(),
  solution: z.string(),
  hints: z.array(z.string()),
})

const phaseSchema = z.object({
  index: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  title: z.string(),
  objective: z.string(),
  puzzles: z.array(puzzleSchema).length(2),
})

const setupGuideSchema = z.object({
  steps: z.array(z.string()),
  materials: z.array(z.string()),
})

const printableSchema = z.object({
  title: z.string(),
  content: z.string(),
})

export const adventurePackSchema = z.object({
  meta: metaSchema,
  story: storySchema,
  characters: z.array(characterSchema),
  phases: z.array(phaseSchema).length(3),
  setupGuide: setupGuideSchema,
  printables: z.array(printableSchema),
})

export type AdventurePackSchema = z.infer<typeof adventurePackSchema>
