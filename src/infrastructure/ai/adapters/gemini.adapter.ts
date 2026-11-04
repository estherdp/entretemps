// src/infrastructure/ai/adapters/gemini.adapter.ts

import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import type { IAdventureProvider, IMissionEditor, AdventureContext } from '@/domain/services'
import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack, GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'
import { AIProviderQuotaError } from '@/domain/errors'
import { aiAdventureOutputSchema, aiMissionOutputSchema } from '@/lib/schemas/ai-adventure-output.schema'
import {
  buildAdventurePrompt,
  buildMissionRegenerationPrompt,
  type AdventureConstraints,
} from '@/infrastructure/ai/prompts/adventure-prompts'

/**
 * Convierte un schema Zod en el JSON Schema que acepta `responseJsonSchema`.
 * Gemini no necesita (ni siempre acepta) la clave `$schema`.
 */
function toGeminiJsonSchema(schema: z.ZodType): Record<string, unknown> {
  const jsonSchema = { ...(z.toJSONSchema(schema) as Record<string, unknown>) }
  delete jsonSchema.$schema
  return jsonSchema
}

const ADVENTURE_JSON_SCHEMA = toGeminiJsonSchema(aiAdventureOutputSchema)
const MISSION_JSON_SCHEMA = toGeminiJsonSchema(aiMissionOutputSchema)

/**
 * Detecta errores de cuota sin depender de las clases del SDK
 * (ApiError expone `status`; algunas versiones solo el mensaje).
 */
function isQuotaError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false
  const status = (error as { status?: unknown }).status
  if (status === 429) return true
  const message = error instanceof Error ? error.message : ''
  return message.includes('RESOURCE_EXHAUSTED') || message.includes('429')
}

/**
 * Adaptador para Google Gemini.
 *
 * Implementa IAdventureProvider y IMissionEditor usando el SDK oficial @google/genai.
 * Server-only: requiere GEMINI_API_KEY en process.env.
 *
 * Usa salida estructurada (`responseJsonSchema`) generada a partir del schema Zod
 * del contrato de IA, de modo que el modelo devuelve siempre JSON con la forma
 * esperada y Zod solo hace de segunda validación.
 *
 * Variables de entorno configurables:
 * - GEMINI_API_KEY (requerida): API key de Google AI Studio
 * - GEMINI_MODEL (opcional): Modelo a usar (default: gemini-2.5-flash-lite)
 * - GEMINI_TEMPERATURE (opcional): Creatividad 0-2 (default: 0.8)
 * - GEMINI_MAX_TOKENS (opcional): Límite de tokens de salida (default: 8192)
 */
export class GeminiAdapter implements IAdventureProvider, IMissionEditor {
  private readonly genAI: GoogleGenAI
  private readonly modelName: string
  private readonly temperature: number
  private readonly maxOutputTokens: number

  constructor(apiKey?: string, modelName?: string, temperature?: number, maxOutputTokens?: number) {
    const key = apiKey || process.env.GEMINI_API_KEY

    if (!key) {
      throw new Error('GEMINI_API_KEY no configurada. Configura la variable de entorno.')
    }

    this.genAI = new GoogleGenAI({ apiKey: key })
    this.modelName = modelName || process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite'
    this.temperature = temperature ?? parseFloat(process.env.GEMINI_TEMPERATURE || '0.8')
    // Las misiones jugables (reto, pistas, tarjetas) ocupan bastante más que antes:
    // con menos tokens el JSON puede salir truncado.
    this.maxOutputTokens = maxOutputTokens ?? parseInt(process.env.GEMINI_MAX_TOKENS || '8192', 10)
  }

  async generateAdventure(
    wizardData: WizardData,
    locale: string,
    constraints: AdventureConstraints
  ): Promise<GeneratedAdventurePack> {
    const prompt = buildAdventurePrompt(wizardData, locale, constraints)
    const data = await this.generateJson(prompt, ADVENTURE_JSON_SCHEMA, this.maxOutputTokens)

    const result = aiAdventureOutputSchema.safeParse(data)
    if (!result.success) {
      throw new Error(`Error al generar aventura con Gemini: Validación falló: ${formatIssues(result.error)}`)
    }

    return {
      ...result.data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
  }

  /**
   * Regenera una misión individual manteniendo la coherencia con el resto del pack.
   */
  async regenerateSingleMission(
    context: AdventureContext,
    currentMission: GeneratedAdventurePackMission,
    feedback: string | undefined,
    locale: string
  ): Promise<GeneratedAdventurePackMission> {
    const prompt = buildMissionRegenerationPrompt(context, currentMission, feedback, locale)
    const data = await this.generateJson(prompt, MISSION_JSON_SCHEMA, 3000)

    const result = aiMissionOutputSchema.safeParse(data)
    if (!result.success) {
      throw new Error(`Error al regenerar misión con Gemini: Validación de misión falló: ${formatIssues(result.error)}`)
    }

    return { ...result.data, order: currentMission.order }
  }

  private async generateJson(
    prompt: string,
    responseJsonSchema: Record<string, unknown>,
    maxOutputTokens: number
  ): Promise<unknown> {
    let text: string | undefined

    try {
      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          temperature: this.temperature,
          maxOutputTokens,
          responseMimeType: 'application/json',
          responseJsonSchema,
        },
      })
      text = response.text
    } catch (error) {
      if (isQuotaError(error)) {
        throw new AIProviderQuotaError()
      }
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error al llamar a Gemini: ${errorMessage}`)
    }

    if (!text) {
      throw new Error('La respuesta de Gemini no contiene texto')
    }

    try {
      return JSON.parse(text)
    } catch (error) {
      // Con salida estructurada esto solo ocurre si la respuesta se trunca por tokens.
      throw new Error(
        `Error al parsear JSON de Gemini (¿respuesta truncada?): ${error instanceof Error ? error.message : 'Error desconocido'}`
      )
    }
  }
}

function formatIssues(error: z.ZodError): string {
  return error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ')
}
