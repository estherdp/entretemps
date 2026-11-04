import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import type { ITemplateRepository } from '@/domain/repositories'

export function getTemplateById(id: string, repository: ITemplateRepository): GeneratedAdventurePack | null {
  return repository.getById(id)
}
