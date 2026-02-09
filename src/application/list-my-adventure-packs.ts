import type { IAdventurePackRepository } from '@/domain/repositories'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export async function listMyAdventurePacks(
  userId: string,
  repository: IAdventurePackRepository
): Promise<SavedAdventurePack[]> {
  return repository.listByUserId(userId)
}
