// src/infrastructure/ai/adapters/index.ts

/**
 * Exporta todos los adaptadores de IA disponibles.
 *
 * Proveedores de Aventura (IAdventureProvider):
 * - OpenAIAdapter: Generación mediante ChatGPT (mock)
 * - GeminiAdapter: Generación mediante Google Gemini
 *
 * Proveedores de Imagen (IImageGenerator):
 * - NanobananaAdapter: Generación de imágenes mediante Gemini (gemini-2.5-flash-image)
 *
 * Nota: N8NAdapter se exporta desde src/infrastructure/n8n/
 */

export { OpenAIAdapter } from './openai.adapter'
export { GeminiAdapter } from './gemini.adapter'
export { NanobananaAdapter } from './nanobanana.adapter'
