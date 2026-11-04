// tests/fixtures/ai-adventure-output.ts

import type { AIAdventureOutput, AIMissionOutput } from '@/lib/schemas/ai-adventure-output.schema'

/**
 * Respuestas de IA válidas según el contrato de salida (aiAdventureOutputSchema).
 */
export function createAIMissionOutput(order: number): AIMissionOutput {
  return {
    order,
    title: `Misión ${order}`,
    story: `Historia de la misión ${order}`,
    parentGuide: `Guía para padres ${order}`,
    successCondition: `Condición de éxito ${order}`,
    challenge: {
      type: 'riddle',
      description: `Acertijo ${order}`,
      solution: `Solución ${order}`,
    },
    hints: ['Pista sutil', 'Pista directa'],
    clueCards: [{ text: `Tarjeta ${order}`, hidingSpot: 'Debajo del cojín' }],
    materials: ['Papel'],
    ageAdaptations: { younger: 'Más fácil', older: 'Más difícil' },
    estimatedMinutes: 15,
  }
}

export function createAIAdventureOutput(missionCount = 2): AIAdventureOutput {
  return {
    title: 'El Secreto de la Selva Esmeralda',
    narrator: { name: 'Tucán Tomás', description: 'Un tucán sabio y despistado' },
    estimatedDurationMinutes: 60,
    ageRange: { min: 6, max: 10 },
    participants: 4,
    difficulty: 'medium',
    tone: 'exciting',
    adventureType: 'adventure',
    place: 'home',
    materials: ['Papel', 'Pinturas', 'Cinta'],
    introduction: {
      story: 'En el corazón de la Selva Esmeralda...',
      setupForParents: 'Esconde las tarjetas antes de empezar.',
    },
    missions: Array.from({ length: missionCount }, (_, i) => createAIMissionOutput(i + 1)),
    conclusion: {
      story: 'La selva vuelve a brillar.',
      celebrationTip: 'Entrega medallas de papel.',
    },
  }
}
