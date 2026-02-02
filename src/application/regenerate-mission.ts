// src/application/regenerate-mission.ts

import type { IMissionEditor, AdventureContext } from '@/domain/services'
import type { GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'
import type { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'

/**
 * Caso de uso: Regenerar una misión individual de un pack guardado.
 *
 * Este caso de uso coordina:
 * 1. Recuperar el pack guardado de la base de datos
 * 2. Extraer el contexto de la aventura y la misión a regenerar
 * 3. Llamar al proveedor de IA para regenerar la misión
 * 4. Actualizar el pack con la nueva misión
 * 5. Persistir los cambios en la base de datos
 *
 * Clean Architecture: Este caso de uso pertenece a la capa de aplicación
 * y orquesta las operaciones entre dominio e infraestructura sin depender
 * de detalles de implementación.
 *
 * @param packId - ID del pack guardado
 * @param userId - ID del usuario (para verificar permisos)
 * @param missionOrder - Orden de la misión a regenerar (1, 2, 3, etc.)
 * @param feedback - Feedback opcional del usuario sobre qué mejorar
 * @param missionEditor - Implementación del editor de misiones (Gemini, OpenAI, etc.)
 * @param repository - Repositorio de packs de aventura
 * @param locale - Idioma de generación (default: 'es')
 * @returns Promise con la misión regenerada
 * @throws Error si el pack no existe, el usuario no tiene permisos, o la misión no existe
 */
export async function regenerateMission(
  packId: string,
  userId: string,
  missionOrder: number,
  feedback: string | undefined,
  missionEditor: IMissionEditor,
  repository: AdventurePackRepository,
  locale: string = 'es'
): Promise<GeneratedAdventurePackMission> {
  // 1. Recuperar el pack guardado
  const savedPack = await repository.getById(packId)

  if (!savedPack) {
    throw new Error('Pack no encontrado')
  }

  // 2. Verificar permisos
  if (savedPack.userId !== userId) {
    throw new Error('No tienes permiso para editar este pack')
  }

  const pack = savedPack.pack

  // 3. Encontrar la misión a regenerar
  const currentMission = pack.missions.find((m) => m.order === missionOrder)

  if (!currentMission) {
    throw new Error(`Misión ${missionOrder} no encontrada en el pack`)
  }

  // 4. Construir el contexto de la aventura
  const context: AdventureContext = {
    title: pack.title,
    ageRange: pack.ageRange,
    adventureType: pack.adventureType,
    tone: pack.tone,
    place: pack.place,
    difficulty: pack.difficulty,
    existingMissions: pack.missions
      .filter((m) => m.order !== missionOrder)
      .map((m) => ({
        order: m.order,
        title: m.title,
        story: m.story,
      })),
  }

  // 5. Regenerar la misión usando el proveedor de IA
  const regeneratedMission = await missionEditor.regenerateSingleMission(
    context,
    currentMission,
    feedback,
    locale
  )

  // 6. Actualizar el pack con la nueva misión
  const updatedMissions = pack.missions.map((m) => (m.order === missionOrder ? regeneratedMission : m))

  const updatedPack = {
    ...pack,
    missions: updatedMissions,
  }

  // 7. Persistir los cambios
  await repository.updatePackJson(packId, updatedPack)

  return regeneratedMission
}
