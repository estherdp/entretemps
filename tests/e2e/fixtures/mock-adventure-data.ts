/**
 * Mock Data para Tests E2E de Generación de Aventuras
 *
 * Este archivo contiene datos de prueba realistas que se usan para
 * mockear las respuestas de las APIs de IA sin consumir créditos.
 */

import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

/**
 * Datos completos de wizard para un test típico
 */
export const mockWizardData: WizardData = {
  occasion: 'birthday',
  ages: { min: 6, max: 8 },
  kidsCount: 4,
  interests: 'dinosaurios y aventuras',
  place: 'home',
  adventureType: 'adventure',
  tone: 'exciting',
  difficulty: 'easy',
}

/**
 * Respuesta exitosa mockeada de /api/generate-adventure
 *
 * Este mock cumple con el schema GeneratedAdventurePack y representa
 * una respuesta típica de la API sin consumir créditos de Gemini/Pollinations.
 */
export const mockSuccessResponse = {
  ok: true,
  pack: {
    id: 'test-adventure-' + Date.now(),
    title: 'La Expedición de los Dinosaurios Perdidos',
    image: {
      url: 'https://picsum.photos/seed/test-dino/800/600',
      prompt: 'dinosaur expedition kids adventure',
    },
    estimatedDurationMinutes: 60,
    ageRange: { min: 6, max: 8 },
    participants: 4,
    difficulty: 'easy' as const,
    tone: 'exciting' as const,
    adventureType: 'adventure' as const,
    place: 'home' as const,
    materials: [
      'Linternas',
      'Mapas impresos',
      'Pegatinas de dinosaurios',
      'Caja de "fósiles" (piedras pintadas)',
    ],
    introduction: {
      story:
        '¡Atención, jóvenes paleontólogos! Se ha descubierto un mapa antiguo que muestra la ubicación de los últimos dinosaurios perdidos. Vuestra misión es seguir las pistas, resolver enigmas y encontrar los tesoros escondidos antes de que caiga la noche.',
      setupForParents:
        'Esconde las pistas por la casa según el mapa. Prepara la caja de "fósiles" en el lugar secreto final. Asegúrate de tener las linternas con pilas cargadas.',
    },
    missions: [
      {
        order: 1,
        title: 'Descifrar el Mapa Antiguo',
        story:
          'El primer desafío es entender el mapa del Dr. Dino. Las coordenadas están escritas en un código especial que debéis descifrar juntos.',
        parentGuide:
          'Entrega el mapa con símbolos simples (círculo = sala, cuadrado = cocina, etc.). Ayúdales a interpretarlo si se atascan.',
        successCondition: 'Los niños identifican correctamente las 3 primeras ubicaciones del mapa.',
      },
      {
        order: 2,
        title: 'La Huella Misteriosa',
        story:
          'Habéis encontrado huellas gigantes en el suelo. Seguid el rastro para descubrir qué dinosaurio pasó por aquí.',
        parentGuide:
          'Coloca huellas de papel en el suelo que lleven de una habitación a otra. Al final, hay una imagen del dinosaurio.',
        successCondition: 'Siguen todas las huellas y encuentran la imagen del Tiranosaurio.',
      },
      {
        order: 3,
        title: 'El Enigma del Fósil',
        story:
          '¡Habéis descubierto un fósil parcial! Pero faltan piezas. Debéis encontrar los fragmentos escondidos para completarlo.',
        parentGuide:
          'Esconde 4-5 piezas de un puzzle simple por la habitación. Una vez reunidas, forman la silueta de un dinosaurio.',
        successCondition: 'Completan el puzzle y gritan "¡Fósil encontrado!"',
      },
    ],
    conclusion: {
      story:
        '¡Enhorabuena, valientes exploradores! Habéis completado la expedición y descubierto todos los secretos de los dinosaurios perdidos. Como recompensa, recibís vuestras medallas de Paleontólogo Junior.',
      celebrationTip:
        'Entrega medallas de cartón decoradas. Haz fotos del equipo con sus "fósiles". Opcional: tarta temática de dinosaurios.',
    },
    createdAt: new Date().toISOString(),
  } as GeneratedAdventurePack,
  warnings: [
    'Imagen generada con placeholder para testing. En producción se usaría Gemini o Pollinations.',
  ],
}

/**
 * Respuesta de error mockeada (500 Internal Server Error)
 *
 * Simula un fallo en la generación de IA para verificar
 * el manejo de errores en la UI.
 */
export const mockErrorResponse = {
  ok: false,
  error: 'Error al generar aventura: Límite de cuota de API excedido. Por favor, intenta más tarde.',
}

/**
 * Respuesta de error de validación (400 Bad Request)
 *
 * Simula datos inválidos en la petición.
 */
export const mockValidationErrorResponse = {
  ok: false,
  error: 'Datos de wizard incompletos. Por favor, completa todos los pasos.',
}
