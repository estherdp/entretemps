import type { IAdventurePackRepository } from '@/domain/repositories'
import { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export async function saveTemplateAsMyPack(
  userId: string,
  pack: GeneratedAdventurePack,
  repository: IAdventurePackRepository
): Promise<SavedAdventurePack> {
  return repository.save({
    userId,
    title: pack.title,
    pack,
  })
}
