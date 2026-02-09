// scripts/test-pollinations.ts
/**
 * Script de prueba para verificar el funcionamiento de PollinationsImageAdapter.
 *
 * Ejecutar con: pnpm test:images
 */

import { PollinationsImageAdapter } from '@/infrastructure/ai/adapters'

async function testPollinationsAdapter() {
  console.log('=== Test de PollinationsImageAdapter ===\n')

  try {
    // Verificar API Key
    const apiKey = process.env.POLLINATIONS_API_KEY
    if (!apiKey) {
      console.error('❌ POLLINATIONS_API_KEY no está configurada')
      process.exit(1)
    }
    console.log('✓ POLLINATIONS_API_KEY encontrada')

    // Crear adaptador
    console.log('\n1. Creando adaptador...')
    const adapter = new PollinationsImageAdapter()
    console.log('✓ Adaptador creado exitosamente')

    // Generar imagen de prueba
    console.log('\n2. Generando imagen de prueba...')
    const prompt = 'Una selva mágica con animales fantásticos'
    console.log(`Prompt: "${prompt}"`)

    const image = await adapter.generateImage(prompt)

    console.log('\n✅ Imagen generada exitosamente:')
    console.log(`   URL: ${image.url}`)
    console.log(`   Prompt mejorado: ${image.prompt}`)

    // Verificar estructura de URL
    console.log('\n3. Verificando estructura de URL...')
    const url = new URL(image.url)
    console.log(`   Host: ${url.hostname}`)
    console.log(`   Width: ${url.searchParams.get('width')}`)
    console.log(`   Height: ${url.searchParams.get('height')}`)
    console.log(`   Model: ${url.searchParams.get('model')}`)
    console.log(`   Seed: ${url.searchParams.get('seed')}`)

    console.log('\n✅ Test completado exitosamente')
  } catch (error) {
    console.error('\n❌ Error durante el test:')
    console.error(error)
    process.exit(1)
  }
}

testPollinationsAdapter()
