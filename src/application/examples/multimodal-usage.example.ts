// src/application/examples/multimodal-usage.example.ts

/**
 * Ejemplos de uso del Orquestador Multimodal.
 *
 * Este archivo muestra las diferentes combinaciones de proveedores
 * y cómo integrar con la persistencia de Supabase.
 */

import type { WizardData } from '@/domain/wizard-data'
import { generateAdventureMultimodal } from '@/application/generate-adventure-multimodal'
import { saveAdventurePack } from '@/application/save-adventure-pack'
import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { N8NAdapter } from '@/infrastructure/n8n/n8n-adapter'
import { OpenAIAdapter, GeminiAdapter } from '@/infrastructure/ai/adapters'
import { PexelsImageAdapter } from '@/infrastructure/images/pexels-image.adapter'

// ============================================================================
// EJEMPLO 1: N8N (texto + imagen integrados)
// ============================================================================
async function example1_N8N_Standalone(userId: string, wizardData: WizardData) {
  console.log('📝 Ejemplo 1: Usando N8N (texto + imagen ya integrados)')

  const n8nProvider = new N8NAdapter()

  // N8N ya devuelve imagen integrada, no necesita generador separado
  const result = await generateAdventureMultimodal(wizardData, n8nProvider)

  if (result.ok && result.pack) {
    console.log('✅ Aventura generada:', result.pack.title)
    console.log('🖼️ Imagen URL:', result.pack.image.url)

    // Guardar en Supabase
    const repository = new AdventurePackRepository()
    const saved = await saveAdventurePack({ userId, pack: result.pack }, repository)

    console.log('💾 Guardado en Supabase con ID:', saved.id)
  } else {
    console.error('❌ Error:', result.error)
  }
}

// ============================================================================
// EJEMPLO 2: OpenAI (texto) + Nanobanana (imagen)
// ============================================================================
async function example2_OpenAI_Plus_Nanobanana(userId: string, wizardData: WizardData) {
  console.log('📝 Ejemplo 2: OpenAI (texto) + Nanobanana (imagen separada)')

  const textProvider = new OpenAIAdapter()
  const imageProvider = new PexelsImageAdapter()

  // El orquestador coordina ambos proveedores
  const result = await generateAdventureMultimodal(wizardData, textProvider, imageProvider)

  if (result.ok && result.pack) {
    console.log('✅ Aventura generada:', result.pack.title)
    console.log('🖼️ Imagen generada con prompt:', result.pack.image.prompt)
    console.log('🖼️ Imagen URL:', result.pack.image.url)

    if (result.warnings) {
      console.warn('⚠️ Warnings:', result.warnings)
    }

    // Guardar en Supabase
    const repository = new AdventurePackRepository()
    const saved = await saveAdventurePack({ userId, pack: result.pack }, repository)

    console.log('💾 Guardado en Supabase con ID:', saved.id)
  } else {
    console.error('❌ Error:', result.error)
  }
}

// ============================================================================
// EJEMPLO 3: Gemini (texto) + Nanobanana (imagen)
// ============================================================================
async function example3_Gemini_Plus_Nanobanana(userId: string, wizardData: WizardData) {
  console.log('📝 Ejemplo 3: Gemini (texto) + Nanobanana (imagen separada)')

  const textProvider = new GeminiAdapter()
  const imageProvider = new PexelsImageAdapter()

  const result = await generateAdventureMultimodal(wizardData, textProvider, imageProvider)

  if (result.ok && result.pack) {
    console.log('✅ Aventura generada:', result.pack.title)
    console.log('🖼️ Imagen URL:', result.pack.image.url)

    // Guardar en Supabase
    const repository = new AdventurePackRepository()
    const saved = await saveAdventurePack({ userId, pack: result.pack }, repository)

    console.log('💾 Guardado en Supabase con ID:', saved.id)
  } else {
    console.error('❌ Error:', result.error)
  }
}

// ============================================================================
// EJEMPLO 4: Resiliencia - Falló la imagen pero guarda la aventura
// ============================================================================
async function example4_Resilience(userId: string, wizardData: WizardData) {
  console.log('📝 Ejemplo 4: Resiliencia ante fallo de imagen')

  const textProvider = new OpenAIAdapter()

  // Simulamos un buscador de imagen que falla
  const faultyImageSearcher = {
    searchCoverImage: async () => {
      throw new Error('Servicio de imágenes no disponible')
    },
  }

  const result = await generateAdventureMultimodal(
    wizardData,
    textProvider,
    faultyImageSearcher
  )

  if (result.ok && result.pack) {
    console.log('✅ Aventura generada (con placeholder de imagen):', result.pack.title)
    console.log('🖼️ Imagen placeholder:', result.pack.image.url)
    console.warn('⚠️ Warnings:', result.warnings)

    // ¡La aventura se guarda igualmente!
    const repository = new AdventurePackRepository()
    const saved = await saveAdventurePack({ userId, pack: result.pack }, repository)

    console.log('💾 Guardado en Supabase con ID:', saved.id)
  }
}

// ============================================================================
// EJEMPLO 5: Factory Pattern - Selección dinámica de proveedor
// ============================================================================
type ProviderType = 'n8n' | 'openai' | 'gemini'

function createAdventureProvider(type: ProviderType) {
  switch (type) {
    case 'n8n':
      return new N8NAdapter()
    case 'openai':
      return new OpenAIAdapter()
    case 'gemini':
      return new GeminiAdapter()
    default:
      throw new Error(`Proveedor desconocido: ${type}`)
  }
}

async function example5_FactoryPattern(
  userId: string,
  wizardData: WizardData,
  providerType: ProviderType
) {
  console.log(`📝 Ejemplo 5: Proveedor dinámico - ${providerType}`)

  // Factory pattern para seleccionar proveedor en runtime
  const provider = createAdventureProvider(providerType)
  const imageGenerator = providerType !== 'n8n' ? new PexelsImageAdapter() : undefined

  const result = await generateAdventureMultimodal(wizardData, provider, imageGenerator)

  if (result.ok && result.pack) {
    console.log('✅ Aventura generada con', providerType, ':', result.pack.title)

    const repository = new AdventurePackRepository()
    const saved = await saveAdventurePack({ userId, pack: result.pack }, repository)

    console.log('💾 Guardado en Supabase con ID:', saved.id)
  }
}

// ============================================================================
// EJEMPLO 6: Uso en API Route (Next.js)
// ============================================================================
export async function handleGenerateAdventureAPI(
  userId: string,
  wizardData: WizardData,
  preferredProvider: ProviderType = 'openai'
) {
  try {
    // Seleccionar proveedor basado en configuración
    const provider = createAdventureProvider(preferredProvider)
    const imageGenerator = preferredProvider !== 'n8n' ? new PexelsImageAdapter() : undefined

    // Generar aventura
    const result = await generateAdventureMultimodal(wizardData, provider, imageGenerator)

    if (!result.ok || !result.pack) {
      return {
        status: 500,
        body: { error: result.error || 'Error desconocido' },
      }
    }

    // Guardar en Supabase
    const repository = new AdventurePackRepository()
    const saved = await saveAdventurePack({ userId, pack: result.pack }, repository)

    return {
      status: 200,
      body: {
        success: true,
        adventureId: saved.id,
        title: saved.title,
        warnings: result.warnings,
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return {
      status: 500,
      body: { error: errorMessage },
    }
  }
}

// ============================================================================
// WIZARD DATA DE EJEMPLO
// ============================================================================
export const exampleWizardData: WizardData = {
  occasion: 'birthday',
  ages: { min: 6, max: 10 },
  kidsCount: 4,
  interests: 'naturaleza, aventuras, animales',
  place: 'home',
  adventureType: 'adventure',
  tone: 'exciting',
  difficulty: 'medium',
}
