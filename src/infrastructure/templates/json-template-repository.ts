// src/infrastructure/templates/json-template-repository.ts

import { z } from 'zod'
import rawTemplates from '@/data/templates/examples.json'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import type { ITemplateRepository } from '@/domain/repositories'
import { generatedAdventurePackSchema } from '@/lib/schemas/generated-adventure-pack.schema'
import { aiMissionOutputSchema } from '@/lib/schemas/ai-adventure-output.schema'

/**
 * Formato de una plantilla en el JSON: un pack completo sin imagen ni fecha,
 * con un id legible y con todos los campos jugables obligatorios (el mismo
 * contrato que exigimos a la IA).
 */
export const templateJsonSchema = generatedAdventurePackSchema
  .omit({ id: true, createdAt: true, image: true })
  .extend({
    id: z.string().regex(/^[a-z0-9-]+$/, 'El id debe ser un slug'),
    missions: z.array(aiMissionOutputSchema).min(1),
  })

// Fecha fija: las plantillas no se "crean", así el render es estable
const TEMPLATE_CREATED_AT = '2025-01-01T00:00:00.000Z'

export function parseTemplates(data: unknown): GeneratedAdventurePack[] {
  return z
    .array(templateJsonSchema)
    .parse(data)
    .map((template) => ({ ...template, createdAt: TEMPLATE_CREATED_AT }))
}

/**
 * Implementación basada en el JSON incluido en la app. Valida el archivo al
 * cargarlo para que una plantilla mal escrita falle pronto y con un mensaje claro.
 */
export class JsonTemplateRepository implements ITemplateRepository {
  private readonly templates: GeneratedAdventurePack[]

  constructor(data: unknown = rawTemplates) {
    this.templates = parseTemplates(data)
  }

  list(): GeneratedAdventurePack[] {
    return this.templates
  }

  getById(id: string): GeneratedAdventurePack | null {
    return this.templates.find((template) => template.id === id) ?? null
  }
}
