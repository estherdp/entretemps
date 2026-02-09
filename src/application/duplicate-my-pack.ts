import type { IAdventurePackRepository } from '@/domain/repositories'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export async function duplicateMyPack(
  packId: string,
  userId: string,
  repository: IAdventurePackRepository
): Promise<SavedAdventurePack> {
  const existingPack = await repository.getById(packId)

  if (!existingPack) {
    throw new Error('Pack no encontrado')
  }

  if (existingPack.userId !== userId) {
    throw new Error('No tienes permiso para duplicar este pack')
  }

  const newPack = {
    ...existingPack.pack,
    id: crypto.randomUUID(),
    title: `${existingPack.pack.title} (copia)`,
    createdAt: new Date().toISOString(),
  }

  return repository.save({
    userId,
    title: newPack.title,
    pack: newPack,
  })
}
