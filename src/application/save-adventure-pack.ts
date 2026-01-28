import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export interface SaveAdventurePackRequest {
  userId: string
  pack: GeneratedAdventurePack
}

export async function saveAdventurePack(
  request: SaveAdventurePackRequest,
  repository: AdventurePackRepository
): Promise<SavedAdventurePack> {
  return repository.save({
    userId: request.userId,
    title: request.pack.title,
    pack: request.pack,
  })
}
