// src/application/generate-adventure-multimodal.ts

import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import type { IAdventureProvider, IImageGenerator } from '@/domain/services'

interface GenerateAdventureMultimodalResult {
  ok: boolean
  error?: string
  pack?: GeneratedAdventurePack
  warnings?: string[]
}

/**
 * Caso de Uso: Generar una aventura con multimodalidad (Texto + Imagen).
 *
 * ORQUESTADOR MULTIMODAL:
 * Este caso de uso coordina dos proveedores de IA independientes:
 * 1. IAdventureProvider: Genera el texto de la aventura y el prompt de imagen
 * 2. IImageGenerator: Genera la imagen basada en el prompt
 *
 * FLUJO SECUENCIAL:
 * 1. Genera la aventura (texto + prompt de imagen)
 * 2. Extrae el prompt de imagen de la aventura generada
 * 3. Genera la imagen usando el prompt
 * 4. Reemplaza la URL de la imagen en el pack
 * 5. Retorna el pack completo listo para persistir en Supabase
 *
 * RESILIENCIA:
 * - Si la generación de imagen falla, mantiene un placeholder
 * - Registra warnings pero no falla toda la operación
 * - La aventura (texto) siempre se guarda, incluso sin imagen
 *
 * COMPATIBILIDAD CON SUPABASE:
 * - El objeto retornado cumple con GeneratedAdventurePack
 * - Puede ser guardado directamente con save-adventure-pack.ts
 *
 * @param wizardData - Datos del wizard
 * @param adventureProvider - Proveedor de generación de texto
 * @param imageGenerator - Proveedor de generación de imagen (opcional)
 * @returns Resultado con el pack completo o error
 */
export async function generateAdventureMultimodal(
  wizardData: WizardData,
  adventureProvider: IAdventureProvider,
  imageGenerator?: IImageGenerator
): Promise<GenerateAdventureMultimodalResult> {
  const warnings: string[] = []

  try {
    // PASO 1: Generar la aventura (texto + prompt de imagen)
    const pack = await adventureProvider.generateAdventure(wizardData, 'es', {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    })

    // PASO 2: Si hay generador de imagen, regenerar la imagen
    if (imageGenerator && pack.image?.prompt) {
      try {
        const newImage = await imageGenerator.generateImage(pack.image.prompt)

        // PASO 3: Reemplazar la imagen en el pack
        pack.image = {
          url: newImage.url,
          prompt: newImage.prompt,
        }
      } catch (imageError) {
        // RESILIENCIA: Si falla la imagen, usamos placeholder
        const errorMessage =
          imageError instanceof Error ? imageError.message : 'Error desconocido'

        warnings.push(`Generación de imagen falló: ${errorMessage}. Usando placeholder.`)

        // Mantener el prompt original pero usar URL placeholder
        pack.image = {
          url: 'https://placehold.co/800x600/1a1a1a/ffffff?text=Imagen+No+Disponible',
          prompt: pack.image.prompt,
        }
      }
    } else if (!imageGenerator && pack.image?.url) {
      // Si no hay generador de imagen, mantenemos la que viene del provider (ej: N8N)
      warnings.push(
        'No se proporcionó generador de imagen. Usando imagen del proveedor de aventura.'
      )
    }

    // PASO 4: Verificar que el pack tiene imagen (aunque sea placeholder)
    if (!pack.image || !pack.image.url) {
      pack.image = {
        url: 'https://placehold.co/800x600/1a1a1a/ffffff?text=Sin+Imagen',
        prompt: 'Sin prompt de imagen disponible',
      }
      warnings.push('No se generó imagen. Usando placeholder por defecto.')
    }

    return {
      ok: true,
      pack,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return {
      ok: false,
      error: `Error al generar la aventura: ${errorMessage}`,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  }
}
