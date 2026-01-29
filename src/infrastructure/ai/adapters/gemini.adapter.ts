// src/infrastructure/ai/adapters/gemini.adapter.ts

import { GoogleGenAI } from '@google/genai'
import type { IAdventureProvider } from '@/domain/services'
import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import { generatedAdventurePackSchema } from '@/lib/schemas/generated-adventure-pack.schema'

/**
 * Adaptador para Google Gemini.
 *
 * Implementa IAdventureProvider usando el SDK oficial @google/genai.
 * Server-only: requiere GEMINI_API_KEY en process.env.
 *
 * Variables de entorno configurables:
 * - GEMINI_API_KEY (requerida): API key de Google AI Studio
 * - GEMINI_MODEL (opcional): Modelo a usar (default: gemini-2.0-flash-exp)
 * - GEMINI_TEMPERATURE (opcional): Creatividad 0-2 (default: 0.7)
 * - GEMINI_MAX_TOKENS (opcional): Límite de tokens de salida (default: 4000)
 *
 * Patrón Adapter: Adapta la API de Gemini a la interfaz IAdventureProvider.
 */
export class GeminiAdapter implements IAdventureProvider {
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
}
