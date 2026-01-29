// src/infrastructure/ai/adapters/openai.adapter.ts

import type { IAdventureProvider } from '@/domain/services'
import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

/**
 * Adaptador MOCK para OpenAI (ChatGPT).
 *
 * Implementa IAdventureProvider devolviendo datos estáticos para
 * probar la arquitectura sin necesidad de configurar API Keys.
 *
 * TODO: Implementar la llamada real a OpenAI API cuando se configure.
 * Ver: https://platform.openai.com/docs/api-reference
 */
export class OpenAIAdapter implements IAdventureProvider {
  async generateAdventure(
    wizardData: WizardData,
    locale: string,
    constraints: { phases: number; puzzlesPerPhase: number; screenFree: boolean }
  ): Promise<GeneratedAdventurePack> {
    // Simulamos latencia de red
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Datos MOCK - Aventura de la Selva
    return {
      id: crypto.randomUUID(),
      title: 'La Gran Aventura de la Selva Misteriosa',
      image: {
        url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
        prompt:
          'Ilustración colorida de una selva tropical mágica con animales amigables, estilo infantil',
      },
      estimatedDurationMinutes: 60,
      ageRange: wizardData.ages || { min: 6, max: 10 },
      participants: wizardData.kidsCount || 4,
      difficulty: wizardData.difficulty || 'medium',
      tone: wizardData.tone || 'exciting',
      adventureType: wizardData.adventureType || 'adventure',
      place: wizardData.place || 'home',
      materials: [
        'Papel y lápices de colores',
        'Cuerda o hilo',
        'Objetos de la naturaleza (hojas, piedras)',
        'Linterna',
      ],
      introduction: {
        story:
          'Los valientes exploradores han descubierto un mapa antiguo que lleva a la Selva Misteriosa. Según la leyenda, en lo más profundo de la selva se encuentra el Templo del Loro Dorado, donde aguarda un tesoro mágico que puede hacer realidad los deseos. ¿Estarán listos para embarcarse en esta gran aventura?',
        setupForParents:
          'Prepara el espacio transformándolo en una selva: cuelga telas verdes, coloca plantas, y crea un ambiente selvático con sonidos de naturaleza de fondo. Esconde pistas por diferentes áreas de la casa que representarán distintas zonas de la selva.',
      },
      missions: [
        {
          order: 1,
          title: 'El Puente Colgante de los Monos',
          story:
            'Los exploradores llegan a un gran precipicio. Para cruzarlo deben construir un puente colgante, pero antes necesitan descifrar el código secreto de los monos guardianes.',
          parentGuide:
            'Crea un "puente" con cuerda en el suelo que los niños deben cruzar sin salirse. El código puede ser una secuencia de movimientos de animales que deben repetir.',
          successCondition:
            'Los niños cruzan el puente correctamente después de resolver el enigma de los monos.',
        },
        {
          order: 2,
          title: 'El Río de los Cocodrilos',
          story:
            'Un río caudaloso bloquea el camino. Los cocodrilos solo dejarán pasar a quienes demuestren ser verdaderos amigos de la naturaleza encontrando 10 tesoros naturales escondidos.',
          parentGuide:
            'Esconde objetos naturales (hojas, piedras, flores) por la zona de juego. Los niños deben encontrarlos todos trabajando en equipo.',
          successCondition:
            'El equipo encuentra los 10 tesoros naturales y puede cruzar el río de forma segura.',
        },
        {
          order: 3,
          title: 'El Templo del Loro Dorado',
          story:
            '¡Han llegado al templo! Pero la puerta está cerrada con un misterioso acertijo del Loro Dorado. Solo los más sabios podrán abrirla y reclamar el tesoro mágico.',
          parentGuide:
            'Prepara un acertijo final apropiado para la edad. Puede ser un puzle, una adivinanza, o un desafío creativo como dibujar la selva entre todos.',
          successCondition:
            'Los exploradores resuelven el acertijo final y descubren el tesoro (puede ser un cofre con medallas, diplomas o dulces).',
        },
      ],
      conclusion: {
        story:
          '¡Felicidades, valientes exploradores! Han demostrado ser dignos guardianes de la Selva Misteriosa. El Loro Dorado les concede su bendición y les nombra Protectores Oficiales de la Naturaleza. El verdadero tesoro no era el oro, sino la aventura compartida y las amistades fortalecidas en el camino.',
        celebrationTip:
          'Entrega diplomas o medallas personalizadas a cada explorador. Pueden tomar fotos con disfraces de exploradores y crear un mural colaborativo dibujando su aventura en la selva.',
      },
      createdAt: new Date().toISOString(),
    }
  }
}
