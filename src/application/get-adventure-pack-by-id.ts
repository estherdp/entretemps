import type { IAdventurePackRepository } from '@/domain/repositories'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export async function getAdventurePackById(
  id: string,
  repository: IAdventurePackRepository
): Promise<SavedAdventurePack | null> {
  return repository.getById(id)
}
