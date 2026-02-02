// src/infrastructure/ai/adapters/gemini.adapter.ts

import { GoogleGenAI } from '@google/genai'
import type { IAdventureProvider, IMissionEditor, AdventureContext } from '@/domain/services'
import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack, GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'
import { generatedAdventurePackSchema } from '@/lib/schemas/generated-adventure-pack.schema'
import { z } from 'zod'

/**
 * Schema Zod para validar misión individual regenerada.
 */
const missionSchema = z.object({
  order: z.number(),
  title: z.string(),
  story: z.string(),
  parentGuide: z.string(),
  successCondition: z.string(),
})

/**
 * Adaptador para Google Gemini.
 *
 * Implementa IAdventureProvider y IMissionEditor usando el SDK oficial @google/genai.
 * Server-only: requiere GEMINI_API_KEY en process.env.
 *
 * Variables de entorno configurables:
 * - GEMINI_API_KEY (requerida): API key de Google AI Studio
 * - GEMINI_MODEL (opcional): Modelo a usar (default: gemini-2.0-flash-exp)
 * - GEMINI_TEMPERATURE (opcional): Creatividad 0-2 (default: 0.7)
 * - GEMINI_MAX_TOKENS (opcional): Límite de tokens de salida (default: 4000)
 *
 * Patrón Adapter: Adapta la API de Gemini a las interfaces del dominio.
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
    this.modelName = modelName || process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp'

    // Temperature: 0.7 balancea creatividad y consistencia
    this.temperature = temperature ?? parseFloat(process.env.GEMINI_TEMPERATURE || '0.7')

    // Max tokens: ~4000 tokens es suficiente para aventuras completas sin excesos
    this.maxOutputTokens = maxOutputTokens ?? parseInt(process.env.GEMINI_MAX_TOKENS || '2500', 10)
  }

  async generateAdventure(
    wizardData: WizardData,
    locale: string,
    constraints: { phases: number; puzzlesPerPhase: number; screenFree: boolean }
  ): Promise<GeneratedAdventurePack> {
    const prompt = this.buildPrompt(wizardData, locale, constraints)

    try {
      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          temperature: this.temperature,
          maxOutputTokens: this.maxOutputTokens,
          responseMimeType: 'application/json', // Forzar respuesta JSON
        },
      })

      const text = response.text

      if (!text) {
        throw new Error('La respuesta de Gemini no contiene texto')
      }

      // Parsear y validar la respuesta
      const adventurePack = this.parseAndValidateResponse(text)

      return adventurePack
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error al generar aventura con Gemini: ${errorMessage}`)
    }
  }

  private buildPrompt(
    wizardData: WizardData,
    locale: string,
    constraints: { phases: number; puzzlesPerPhase: number; screenFree: boolean }
  ): string {
    const languageInstruction = locale === 'es' ? 'español' : 'inglés'

    return `Eres un experto en crear aventuras educativas para niños. Genera una aventura completa basada en los siguientes parámetros:

PARÁMETROS DE LA AVENTURA:
- Ocasión: ${wizardData.occasion || 'no especificada'}
- Edades: ${wizardData.ages ? `${wizardData.ages.min}-${wizardData.ages.max} años` : 'no especificadas'}
- Número de niños: ${wizardData.kidsCount || 'no especificado'}
- Intereses: ${wizardData.interests || 'no especificados'}
- Lugar: ${wizardData.place || 'no especificado'}
- Tipo de aventura: ${wizardData.adventureType || 'no especificado'}
- Tono: ${wizardData.tone || 'no especificado'}
- Dificultad: ${wizardData.difficulty || 'no especificado'}
- Idioma de salida: ${languageInstruction}

RESTRICCIONES:
- Número de misiones: ${constraints.phases || 3}
- Sin pantallas: ${constraints.screenFree ? 'Sí' : 'No'}

INSTRUCCIONES CRÍTICAS:
1. Genera EXACTAMENTE ${constraints.phases || 3} misiones numeradas desde 1
2. Proporciona materiales específicos y realistas para la aventura
3. La respuesta debe ser ÚNICAMENTE JSON válido, SIN texto adicional, SIN markdown, SIN comentarios
4. El JSON debe seguir EXACTAMENTE esta estructura (sin incluir el campo "id"):

{
  "title": "Título de la aventura",
  "image": {
    "url": "https://images.unsplash.com/photo-XXXXX?w=800",
    "prompt": "Descripción para generación de imagen"
  },
  "estimatedDurationMinutes": 60,
  "ageRange": { "min": 6, "max": 10 },
  "participants": 4,
  "difficulty": "easy | medium | hard",
  "tone": "funny | enigmatic | exciting | calm",
  "adventureType": "mystery | adventure | fantasy | action | humor",
  "place": "home | garden | park | indoor | outdoor",
  "materials": ["Material 1", "Material 2", "Material 3"],
  "introduction": {
    "story": "Historia introductoria envolvente para los niños",
    "setupForParents": "Instrucciones detalladas para que los padres preparen la aventura"
  },
  "missions": [
    {
      "order": 1,
      "title": "Título de la misión 1",
      "story": "Narrativa de la misión para los niños",
      "parentGuide": "Guía detallada para que los padres faciliten esta misión",
      "successCondition": "Criterio claro de éxito de la misión"
    }
  ],
  "conclusion": {
    "story": "Conclusión épica de la aventura para los niños",
    "celebrationTip": "Sugerencia para celebrar el éxito de la aventura"
  }
}

IMPORTANTE: Responde ÚNICAMENTE con el objeto JSON. No incluyas texto antes o después del JSON. No uses bloques de código markdown.`
  }

  private parseAndValidateResponse(text: string): GeneratedAdventurePack {
    // Limpiar markdown fences si existen
    let cleanedText = text.trim()

    // Remover bloques de código markdown (```json ... ``` o ``` ... ```)
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
    }

    // Extraer JSON entre primer "{" y último "}"
    const firstBrace = cleanedText.indexOf('{')
    const lastBrace = cleanedText.lastIndexOf('}')

    if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
      throw new Error('No se encontró un JSON válido en la respuesta de Gemini')
    }

    const jsonText = cleanedText.substring(firstBrace, lastBrace + 1)

    // Parsear JSON
    let parsedData: unknown
    try {
      parsedData = JSON.parse(jsonText)
    } catch (error) {
      throw new Error(`Error al parsear JSON de respuesta Gemini: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }

    // Asegurar que tenga id y createdAt antes de validar
    if (parsedData && typeof parsedData === 'object') {
      const dataObj = parsedData as Record<string, unknown>

      // Generar UUID si no existe o no es válido
      if (!dataObj.id || typeof dataObj.id !== 'string') {
        dataObj.id = crypto.randomUUID()
      }

      // Generar createdAt si no existe
      if (!dataObj.createdAt) {
        dataObj.createdAt = new Date().toISOString()
      }
    }

    // Validar con schema Zod
    const validationResult = generatedAdventurePackSchema.safeParse(parsedData)

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      throw new Error(`Validación falló: ${errorMessages}`)
    }

    // Asegurar que el resultado tenga id (TypeScript requiere que no sea opcional)
    const result = validationResult.data
    if (!result.id) {
      result.id = crypto.randomUUID()
    }

    return result as GeneratedAdventurePack
  }

  /**
   * Regenera una misión individual basándose en el contexto de la aventura.
   *
   * Implementación del método IMissionEditor.regenerateSingleMission.
   * Usa un prompt especializado de "Editor" que recibe el contexto completo
   * de la aventura para generar una misión coherente con el resto del pack.
   */
  async regenerateSingleMission(
    context: AdventureContext,
    currentMission: GeneratedAdventurePackMission,
    feedback: string | undefined,
    locale: string
  ): Promise<GeneratedAdventurePackMission> {
    const prompt = this.buildMissionRegenerationPrompt(context, currentMission, feedback, locale)

    try {
      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          temperature: this.temperature,
          maxOutputTokens: 1500, // Una misión requiere menos tokens que un pack completo
          responseMimeType: 'application/json', // Forzar respuesta JSON
        },
      })

      const text = response.text

      if (!text) {
        throw new Error('La respuesta de Gemini no contiene texto')
      }

      // Parsear y validar la misión regenerada
      const regeneratedMission = this.parseAndValidateMission(text, currentMission.order)

      return regeneratedMission
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error al regenerar misión con Gemini: ${errorMessage}`)
    }
  }

  /**
   * Construye el prompt para regenerar una misión individual.
   */
  private buildMissionRegenerationPrompt(
    context: AdventureContext,
    currentMission: GeneratedAdventurePackMission,
    feedback: string | undefined,
    locale: string
  ): string {
    const languageInstruction = locale === 'es' ? 'español' : 'inglés'

    // Construir lista de misiones existentes para contexto
    const existingMissionsContext = context.existingMissions
      ? `\n\nMISIONES EXISTENTES EN LA AVENTURA:\n${context.existingMissions
          .map((m) => `${m.order}. ${m.title}: ${m.story.substring(0, 150)}...`)
          .join('\n')}`
      : ''

    const feedbackSection = feedback
      ? `\n\nFEEDBACK DEL USUARIO:\n${feedback}\n\nTen en cuenta este feedback al regenerar la misión.`
      : ''

    return `Eres un experto editor de aventuras educativas para niños. Tu tarea es REGENERAR la misión ${currentMission.order} de una aventura existente, manteniendo coherencia con el contexto general.

CONTEXTO DE LA AVENTURA:
- Título: ${context.title}
- Edades: ${context.ageRange.min}-${context.ageRange.max} años
- Tipo: ${context.adventureType}
- Tono: ${context.tone}
- Lugar: ${context.place}
- Dificultad: ${context.difficulty}
- Idioma: ${languageInstruction}${existingMissionsContext}

MISIÓN ACTUAL (que se va a regenerar):
- Orden: ${currentMission.order}
- Título actual: ${currentMission.title}
- Historia actual: ${currentMission.story}
- Guía para padres: ${currentMission.parentGuide}
- Condición de éxito: ${currentMission.successCondition}${feedbackSection}

INSTRUCCIONES CRÍTICAS:
1. Regenera ÚNICAMENTE la misión ${currentMission.order} manteniendo coherencia con el resto de la aventura
2. La nueva misión debe tener el mismo nivel de dificultad y adecuarse a las edades especificadas
3. Mantén el tono (${context.tone}) y el tipo de aventura (${context.adventureType})
4. Si hay otras misiones en el contexto, asegúrate de que esta misión sea coherente con ellas
5. La respuesta debe ser ÚNICAMENTE JSON válido, SIN texto adicional, SIN markdown, SIN comentarios

ESTRUCTURA JSON REQUERIDA:
{
  "order": ${currentMission.order},
  "title": "Nuevo título de la misión",
  "story": "Nueva narrativa emocionante para los niños (mínimo 150 palabras)",
  "parentGuide": "Guía detallada y práctica para que los padres faciliten esta misión",
  "successCondition": "Criterio claro y medible de éxito de la misión"
}

IMPORTANTE: Responde ÚNICAMENTE con el objeto JSON de la misión. No incluyas texto antes o después del JSON. No uses bloques de código markdown.`
  }

  /**
   * Parsea y valida una misión regenerada desde la respuesta de Gemini.
   */
  private parseAndValidateMission(text: string, expectedOrder: number): GeneratedAdventurePackMission {
    // Limpiar markdown fences si existen
    let cleanedText = text.trim()

    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
    }

    // Extraer JSON entre primer "{" y último "}"
    const firstBrace = cleanedText.indexOf('{')
    const lastBrace = cleanedText.lastIndexOf('}')

    if (firstBrace === -1 || lastBrace === -1 || firstBrace > lastBrace) {
      throw new Error('No se encontró un JSON válido en la respuesta de Gemini')
    }

    const jsonText = cleanedText.substring(firstBrace, lastBrace + 1)

    // Parsear JSON
    let parsedData: unknown
    try {
      parsedData = JSON.parse(jsonText)
    } catch (error) {
      throw new Error(`Error al parsear JSON de misión: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }

    // Validar con schema Zod
    const validationResult = missionSchema.safeParse(parsedData)

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      throw new Error(`Validación de misión falló: ${errorMessages}`)
    }

    const mission = validationResult.data

    // Verificar que el order sea el esperado
    if (mission.order !== expectedOrder) {
      mission.order = expectedOrder
    }

    return mission
  }
}
