import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export async function listMyAdventurePacks(
  userId: string,
  repository: AdventurePackRepository
): Promise<SavedAdventurePack[]> {
  return repository.listByUserId(userId)
}
