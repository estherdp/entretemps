// src/scripts/test-multimodal.ts
// Ejecutar con: npx tsx src/scripts/test-multimodal.ts

import { generateAdventureMultimodal } from '@/application/generate-adventure-multimodal'
import { OpenAIAdapter, GeminiAdapter, PollinationsImageAdapter } from '@/infrastructure/ai/adapters'
import { PexelsImageAdapter } from '@/infrastructure/images'
import { ImageCacheRepository } from '@/infrastructure/supabase'
import type { WizardData } from '@/domain/wizard-data'

const testWizardData: WizardData = {
  occasion: 'birthday',
  ages: { min: 6, max: 10 },
  kidsCount: 4,
  interests: 'naturaleza, aventuras, animales',
  place: 'home',
  adventureType: 'adventure',
  tone: 'exciting',
  difficulty: 'medium',
}

async function testOpenAI() {
  console.log('\n🔵 Probando OpenAI Adapter...')
  const provider = new OpenAIAdapter()
  const result = await generateAdventureMultimodal(testWizardData, provider)

  if (result.ok && result.pack) {
    console.log('✅ Aventura generada:', result.pack.title)
    console.log('📊 Misiones:', result.pack.missions.length)
    console.log('🖼️ Imagen:', result.pack.image.url)
    if (result.warnings) {
      console.log('⚠️ Warnings:', result.warnings)
    }
  } else {
    console.error('❌ Error:', result.error)
  }
}

async function testGemini() {
  console.log('\n🟢 Probando Gemini Adapter...')
  const provider = new GeminiAdapter()
  const result = await generateAdventureMultimodal(testWizardData, provider)

  if (result.ok && result.pack) {
    console.log('✅ Aventura generada:', result.pack.title)
    console.log('📊 Misiones:', result.pack.missions.length)
    console.log('🖼️ Imagen:', result.pack.image.url)
  } else {
    console.error('❌ Error:', result.error)
  }
}

async function testMultimodal() {
  console.log('\n🎨 Probando Orquestador Multimodal (OpenAI + Nanobanana)...')
  const textProvider = new OpenAIAdapter()
  const imageProvider = new PexelsImageAdapter()

  const result = await generateAdventureMultimodal(
    testWizardData,
    textProvider,
    imageProvider
  )

  if (result.ok && result.pack) {
    console.log('✅ Aventura generada:', result.pack.title)
    console.log('📝 Texto generado por:', 'OpenAI')
    console.log('🖼️ Imagen generada por:', 'Nanobanana')
    console.log('🔗 URL de imagen:', result.pack.image.url)
    console.log('💬 Prompt de imagen:', result.pack.image.prompt)

    if (result.warnings) {
      console.log('⚠️ Warnings:', result.warnings)
    }

    // Mostrar estructura completa
    console.log('\n📦 Estructura del pack:')
    console.log('  - Introducción:', result.pack.introduction.story.substring(0, 100) + '...')
    console.log('  - Misiones:', result.pack.missions.map(m => m.title).join(', '))
    console.log('  - Materiales:', result.pack.materials.join(', '))
  } else {
    console.error('❌ Error:', result.error)
  }
}

async function testComparison() {
  console.log('\n⚖️ Comparando proveedores...')

  const providers = [
    { name: 'OpenAI', adapter: new OpenAIAdapter() },
    { name: 'Gemini', adapter: new GeminiAdapter() },
  ]

  for (const { name, adapter } of providers) {
    const result = await generateAdventureMultimodal(testWizardData, adapter)
    if (result.ok && result.pack) {
      console.log(`\n${name}:`)
      console.log('  Título:', result.pack.title)
      console.log('  Duración:', result.pack.estimatedDurationMinutes, 'min')
      console.log('  Primera misión:', result.pack.missions[0].title)
    }
  }
}

async function testPexels() {
  console.log('\n🖼️ Probando Búsqueda de Imágenes con Pexels...')
  const provider = new GeminiAdapter()
  const imageSearcher = new PexelsImageAdapter()
  const imageCacheRepo = new ImageCacheRepository()

  const result = await generateAdventureMultimodal(
    testWizardData,
    provider,
    imageSearcher,      // Busca en Pexels (prioridad)
    imageCacheRepo,     // Usa caché de 24h
    undefined           // Sin generador IA
  )

  if (result.ok && result.pack) {
    console.log('✅ Aventura generada:', result.pack.title)
    console.log('🖼️ Imagen URL:', result.pack.image.url)
    console.log('📝 Imagen prompt:', result.pack.image.prompt)

    if (result.warnings) {
      console.log('⚠️ Warnings:', result.warnings)
    }

    // Verificar origen de la imagen
    if (result.pack.image.url.includes('pexels.com')) {
      console.log('✅ Imagen de Pexels detectada')
    } else if (result.pack.image.url.includes('placehold.co')) {
      console.log('⚠️ Usando placeholder (Pexels no encontró imagen o falló)')
    } else {
      console.log('❓ Imagen de origen desconocido:', result.pack.image.url)
    }
  } else {
    console.error('❌ Error:', result.error)
  }
}

async function testPexelsWithFallback() {
  console.log('\n🔄 Probando Pexels con Fallback a IA...')
  const provider = new GeminiAdapter()
  const imageSearcher = new PexelsImageAdapter()
  const imageCacheRepo = new ImageCacheRepository()
  const imageGenerator = new PollinationsImageAdapter()

  const result = await generateAdventureMultimodal(
    testWizardData,
    provider,
    imageSearcher,      // Intenta Pexels primero
    imageCacheRepo,     // Usa caché
    imageGenerator      // Fallback a generación IA
  )

  if (result.ok && result.pack) {
    console.log('✅ Aventura generada:', result.pack.title)
    console.log('🖼️ Imagen URL:', result.pack.image.url)

    if (result.warnings) {
      console.log('⚠️ Warnings:', result.warnings)

      // Analizar warnings para saber qué método se usó
      const usedPexels = result.warnings.some(w => w.includes('Pexels'))
      const usedAI = result.warnings.some(w => w.includes('Imagen generada por IA'))
      const usedPlaceholder = result.warnings.some(w => w.includes('placeholder'))

      if (usedPexels) {
        console.log('✅ Usó imagen de Pexels')
      } else if (usedAI) {
        console.log('🤖 Usó generación por IA (fallback)')
      } else if (usedPlaceholder) {
        console.log('📦 Usó placeholder (ambos fallaron)')
      }
    }
  } else {
    console.error('❌ Error:', result.error)
  }
}

async function main() {
  console.log('🚀 Iniciando pruebas del orquestador multimodal...\n')

  try {
    // Pruebas básicas
    await testOpenAI()
    await testGemini()
    await testMultimodal()
    await testComparison()

    // Pruebas con Pexels (NUEVO)
    console.log('\n' + '='.repeat(60))
    console.log('🆕 PRUEBAS CON PEXELS IMAGE SEARCH')
    console.log('='.repeat(60))

    await testPexels()
    await testPexelsWithFallback()

    console.log('\n✅ Todas las pruebas completadas exitosamente!')
  } catch (error) {
    console.error('\n❌ Error en las pruebas:', error)
  }
}

main()
