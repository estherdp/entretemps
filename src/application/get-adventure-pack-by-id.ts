import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export async function getAdventurePackById(
  id: string,
  repository: AdventurePackRepository
): Promise<SavedAdventurePack | null> {
  return repository.getById(id)
}
