// src/application/reorder-missions.ts

import type { GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'
import type { IAdventurePackRepository } from '@/domain/repositories'

/**
 * Caso de uso: Reordenar las misiones de un pack guardado.
 *
 * Este caso de uso coordina:
 * 1. Recuperar el pack guardado de la base de datos
 * 2. Validar que el nuevo orden sea consistente
 * 3. Actualizar el campo 'order' de cada misión según el nuevo orden
 * 4. Persistir los cambios en la base de datos
 *
 * Clean Architecture: Este caso de uso pertenece a la capa de aplicación
 * y orquesta las operaciones entre dominio e infraestructura sin depender
 * de detalles de implementación.
 *
 * @param packId - ID del pack guardado
 * @param userId - ID del usuario (para verificar permisos)
 * @param newOrder - Array con los orders de las misiones en el nuevo orden deseado
 *                   Ejemplo: [3, 1, 2] significa que la misión 3 va primero, luego 1, luego 2
 * @param repository - Repositorio de packs de aventura
 * @returns Promise con el array de misiones reordenadas
 * @throws Error si el pack no existe, el usuario no tiene permisos, o el orden es inválido
 */
export async function reorderMissions(
  packId: string,
  userId: string,
  newOrder: number[],
  repository: IAdventurePackRepository
): Promise<GeneratedAdventurePackMission[]> {
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

  // 3. Validar que el nuevo orden sea consistente
  if (newOrder.length !== pack.missions.length) {
    throw new Error('El nuevo orden debe contener todas las misiones')
  }

  // Verificar que todos los orders existan
  const existingOrders = new Set(pack.missions.map((m) => m.order))
  for (const order of newOrder) {
    if (!existingOrders.has(order)) {
      throw new Error(`Orden inválido: la misión ${order} no existe`)
    }
  }

  // Verificar que no haya duplicados
  if (new Set(newOrder).size !== newOrder.length) {
    throw new Error('El nuevo orden contiene misiones duplicadas')
  }

  // 4. Crear un mapa de misiones por order original
  const missionsMap = new Map<number, GeneratedAdventurePackMission>()
  pack.missions.forEach((mission) => {
    missionsMap.set(mission.order, mission)
  })

  // 5. Reordenar las misiones según el nuevo orden
  // El nuevo order será la posición en el array (1-indexed)
  const reorderedMissions = newOrder.map((originalOrder, index) => {
    const mission = missionsMap.get(originalOrder)!
    return {
      ...mission,
      order: index + 1, // Los orders van de 1 a N
    }
  })

  // 6. Actualizar el pack con las misiones reordenadas
  const updatedPack = {
    ...pack,
    missions: reorderedMissions,
  }

  // 7. Persistir los cambios
  await repository.updatePackJson(packId, updatedPack)

  return reorderedMissions
}
