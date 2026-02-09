import type { IAdventurePackRepository } from '@/domain/repositories'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export interface PackTextChanges {
  title?: string
  imageUrl?: string
  introductionStory?: string
  missionsStory?: { order: number; story: string }[]
  conclusionStory?: string
  introductionSetupForParents?: string
}

export async function updateMyPackText(
  packId: string,
  userId: string,
  changes: PackTextChanges,
  repository: IAdventurePackRepository
): Promise<SavedAdventurePack> {
  const existingPack = await repository.getById(packId)

  if (!existingPack) {
    throw new Error('Pack no encontrado')
  }

  if (existingPack.userId !== userId) {
    throw new Error('No tienes permiso para editar este pack')
  }

  const updatedPack = { ...existingPack.pack }

  if (changes.title !== undefined) {
    updatedPack.title = changes.title
  }

  if (changes.imageUrl !== undefined) {
    updatedPack.image = {
      ...updatedPack.image,
      url: changes.imageUrl,
    }
  }

  if (changes.introductionStory !== undefined) {
    updatedPack.introduction = {
      ...updatedPack.introduction,
      story: changes.introductionStory,
    }
  }

  if (changes.introductionSetupForParents !== undefined) {
    updatedPack.introduction = {
      ...updatedPack.introduction,
      setupForParents: changes.introductionSetupForParents,
    }
  }

  if (changes.missionsStory) {
    updatedPack.missions = updatedPack.missions.map((mission) => {
      const change = changes.missionsStory?.find((m) => m.order === mission.order)
      if (change) {
        return { ...mission, story: change.story }
      }
      return mission
    })
  }

  if (changes.conclusionStory !== undefined) {
    updatedPack.conclusion = {
      ...updatedPack.conclusion,
      story: changes.conclusionStory,
    }
  }

  return repository.updatePackJson(packId, updatedPack)
}
