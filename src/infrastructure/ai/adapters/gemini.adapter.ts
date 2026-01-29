// src/infrastructure/ai/adapters/gemini.adapter.ts

import type { IAdventureProvider } from '@/domain/services'
import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

/**
 * Adaptador MOCK para Google Gemini.
 *
 * Implementa IAdventureProvider devolviendo datos estáticos para
 * probar la arquitectura sin necesidad de configurar API Keys.
 *
 * TODO: Implementar la llamada real a Gemini API cuando se configure.
 * Ver: https://ai.google.dev/docs
 */
export class GeminiAdapter implements IAdventureProvider {
  async generateAdventure(
    wizardData: WizardData,
    locale: string,
    constraints: { phases: number; puzzlesPerPhase: number; screenFree: boolean }
  ): Promise<GeneratedAdventurePack> {
    // Simulamos latencia de red (más rápido que OpenAI)
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Datos MOCK - Aventura de la Selva (variante Gemini)
    return {
      id: crypto.randomUUID(),
      title: 'El Secreto de la Selva Esmeralda',
      image: {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        prompt:
          'Selva tropical vibrante con cascadas y animales exóticos, arte digital para niños',
      },
      estimatedDurationMinutes: 60,
      ageRange: wizardData.ages || { min: 6, max: 10 },
      participants: wizardData.kidsCount || 4,
      difficulty: wizardData.difficulty || 'medium',
      tone: wizardData.tone || 'exciting',
      adventureType: wizardData.adventureType || 'adventure',
      place: wizardData.place || 'home',
      materials: [
        'Hojas de papel reciclado',
        'Pinturas o crayones',
        'Telas verdes para decorar',
        'Elementos naturales del jardín',
      ],
      introduction: {
        story:
          'En el corazón de la Selva Esmeralda existe una leyenda sobre el Árbol de los Mil Colores, que florece solo cuando aventureros valientes demuestran su respeto por la naturaleza. Los guardianes de la selva han enviado una invitación especial a estos pequeños exploradores para encontrar el árbol mágico.',
        setupForParents:
          'Transforma tu hogar en la Selva Esmeralda usando telas verdes, plantas de interior y decoraciones naturales. Prepara estaciones diferentes para cada misión y ten listas las pistas antes de comenzar.',
      },
      missions: [
        {
          order: 1,
          title: 'El Guardián Tucán y su Enigma',
          story:
            'El sabio Tucán guardián bloquea el sendero y presenta un desafío: los exploradores deben crear un mapa de la selva usando solo elementos naturales que encuentren alrededor.',
          parentGuide:
            'Proporciona materiales naturales (hojas, ramitas, piedras) y papel. Los niños deben crear colaborativamente un mapa artístico de su "selva".',
          successCondition:
            'El equipo completa un mapa creativo de la selva y el Tucán les permite pasar.',
        },
        {
          order: 2,
          title: 'La Cascada de los Deseos',
          story:
            'Una cascada mágica aparece ante ellos. Las mariposas que viven allí han perdido sus colores. Los exploradores deben devolverles la alegría pintando mariposas con los colores del arcoíris.',
          parentGuide:
            'Prepara plantillas de mariposas de papel. Los niños deben pintarlas y decorar el espacio con ellas. Pueden usar colores vibrantes y purpurina.',
          successCondition:
            'Cada niño crea al menos una mariposa colorida y las cuelgan formando un arcoíris.',
        },
        {
          order: 3,
          title: 'El Árbol de los Mil Colores',
          story:
            '¡El árbol aparece! Pero está dormido. Para despertarlo, los exploradores deben cantar la Canción de la Naturaleza que han aprendido en su viaje, recordando todo lo que han visto.',
          parentGuide:
            'Guía a los niños para que inventen una canción sencilla sobre la selva, mencionando los animales y lugares que han "visitado". Pueden usar instrumentos improvisados.',
          successCondition:
            'Los niños crean y cantan su canción juntos, despertando al árbol mágico.',
        },
      ],
      conclusion: {
        story:
          '¡El Árbol de los Mil Colores florece en toda su gloria! Sus flores brillantes son el regalo para estos valientes exploradores que han demostrado amor y respeto por la naturaleza. Cada uno recibe una semilla mágica (imaginaria) que llevarán en su corazón para siempre.',
        celebrationTip:
          'Realiza una ceremonia de entrega de "semillas mágicas" (pueden ser pegatinas o pequeñas piedras pintadas). Toma fotos del grupo con sus creaciones artísticas y celebra con un snack temático de la selva.',
      },
      createdAt: new Date().toISOString(),
    }
  }
}
