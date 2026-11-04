// src/infrastructure/ai/prompts/adventure-prompts.ts

import type { WizardData } from '@/domain/wizard-data'
import type { AdventureContext } from '@/domain/services'
import type { GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'

/**
 * Prompts compartidos por todos los adaptadores de texto.
 *
 * Viven en infraestructura porque son detalles de cómo se habla con un LLM,
 * pero no dependen de ningún SDK: cualquier adaptador (Gemini, OpenAI, Groq...)
 * puede reutilizarlos. El formato de salida lo impone cada adaptador mediante
 * salida estructurada, por eso aquí no se describe el JSON.
 */

export interface AdventureConstraints {
  phases: number
  puzzlesPerPhase: number
  screenFree: boolean
}

const PLACE_HINTS: Record<NonNullable<WizardData['place']>, string> = {
  home: 'dentro de casa: cojines, armarios, debajo de la mesa, dentro de un libro, en la nevera',
  garden: 'en un jardín o patio: macetas, detrás de un árbol, bajo una piedra, junto a la regadera',
  park: 'en un parque público: bancos, troncos, columpios (sin esconder nada que pueda perderse o molestar a otros)',
  indoor: 'en un espacio interior amplio (salón de actos, ludoteca): sillas, rincones, cajas',
  outdoor: 'al aire libre en general: árboles, rocas, vallas, siempre a la vista del adulto',
}

function languageName(locale: string): string {
  return locale === 'en' ? 'inglés' : 'español'
}

const SYSTEM_ROLE = `Eres diseñador/a de juegos infantiles y educador/a de tiempo libre.
Creas aventuras de juego físico SIN PANTALLAS que un adulto prepara en 15 minutos con objetos que ya tiene en casa.`

const QUALITY_RULES = `REGLAS DE CALIDAD:
- Todo se juega en el mundo físico: moverse, buscar, construir, dibujar, colaborar. Nunca uses móviles, tablets ni pantallas.
- Cada misión tiene UN reto concreto y resoluble (acertijo, puzzle, búsqueda, prueba física, reto creativo o mensaje cifrado) con su solución exacta.
- Las pistas ("hints") van de más sutil a más directa, para que el adulto ayude sin dar la respuesta de golpe.
- Las tarjetas de pista ("clueCards") son textos cortos que el adulto imprime y esconde; "hidingSpot" dice dónde esconderlas.
- Las misiones se encadenan: la solución o la tarjeta de una misión lleva a la siguiente.
- El narrador aparece en la introducción, en cada misión y en el final, con una voz propia.
- Vocabulario y longitud de frases adecuados a la edad mínima del grupo. Las historias para leer en voz alta: 80-150 palabras.
- "ageAdaptations" explica cómo simplificar el reto para los pequeños y cómo complicarlo para los mayores.
- Materiales comunes y baratos (papel, cinta, cojines, linterna...). Nada peligroso: sin fuego, objetos cortantes ni alturas.
- Fomenta la cooperación: que ganen todos juntos, sin eliminar a nadie.
- No pidas ni inventes nombres reales de los niños.`

export function buildAdventurePrompt(
  wizardData: WizardData,
  locale: string,
  constraints: AdventureConstraints
): string {
  const placeHint = wizardData.place ? PLACE_HINTS[wizardData.place] : 'el espacio disponible'

  return `${SYSTEM_ROLE}

Diseña una aventura completa con estos parámetros:
- Ocasión: ${wizardData.occasion ?? 'no especificada'}
- Edades: ${wizardData.ages ? `${wizardData.ages.min}-${wizardData.ages.max} años` : 'no especificadas'}
- Número de niños: ${wizardData.kidsCount ?? 'no especificado'}
- Temática / intereses: ${wizardData.interests || 'libre'}
- Lugar: ${wizardData.place ?? 'no especificado'} (escondites posibles: ${placeHint})
- Tipo de aventura: ${wizardData.adventureType ?? 'no especificado'}
- Tono: ${wizardData.tone ?? 'no especificado'}
- Dificultad: ${wizardData.difficulty ?? 'no especificada'}
- Idioma de todos los textos: ${languageName(locale)}

ESTRUCTURA:
- Exactamente ${constraints.phases} misiones, numeradas desde 1.
- Entre 1 y ${constraints.puzzlesPerPhase} tarjetas de pista por misión.
- "materials" del pack: lista completa y sin duplicados de todo lo necesario.
- "estimatedDurationMinutes" debe ser coherente con la suma de las misiones.
- Los campos "difficulty", "tone", "adventureType" y "place" deben coincidir con los parámetros.

${QUALITY_RULES}`
}

export function buildMissionRegenerationPrompt(
  context: AdventureContext,
  currentMission: GeneratedAdventurePackMission,
  feedback: string | undefined,
  locale: string
): string {
  const otherMissions = context.existingMissions?.length
    ? context.existingMissions
        .map((m) => `${m.order}. ${m.title}: ${m.story.substring(0, 150)}...`)
        .join('\n')
    : 'ninguna'

  const narrator = context.narrator
    ? `${context.narrator.name} (${context.narrator.description})`
    : 'el mismo narrador que el resto de la aventura'

  const feedbackSection = feedback
    ? `\nPETICIÓN DEL ADULTO (prioritaria):\n${feedback}\n`
    : ''

  return `${SYSTEM_ROLE}

Tienes que REESCRIBIR la misión ${currentMission.order} de una aventura existente, manteniendo la coherencia con el resto.

CONTEXTO DE LA AVENTURA:
- Título: ${context.title}
- Edades: ${context.ageRange.min}-${context.ageRange.max} años
- Tipo: ${context.adventureType}
- Tono: ${context.tone}
- Lugar: ${context.place} (escondites posibles: ${PLACE_HINTS[context.place]})
- Dificultad: ${context.difficulty}
- Narrador: ${narrator}
- Idioma: ${languageName(locale)}

OTRAS MISIONES (no las cambies, encaja con ellas):
${otherMissions}

MISIÓN ACTUAL:
- Título: ${currentMission.title}
- Historia: ${currentMission.story}
- Reto: ${currentMission.challenge?.description ?? 'no definido'}
${feedbackSection}
Devuelve la misión con "order" = ${currentMission.order} y un reto distinto al actual.

${QUALITY_RULES}`
}
