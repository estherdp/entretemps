import { GeneratedAdventurePack } from './generated-adventure-pack'

export interface SavedAdventurePack {
  id: string
  userId: string
  title: string
  pack: GeneratedAdventurePack
  createdAt: string
}
