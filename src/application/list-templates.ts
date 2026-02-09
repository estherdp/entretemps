import templates from '@/data/templates/examples.json'
import { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

/**
 * Tipo para las plantillas en el JSON.
 * Incluye campos adicionales que no están en GeneratedAdventurePack.
 */
interface TemplateJSON {
  id: string
  title: string
  imageUrl?: string
  estimatedDurationMinutes: number
  ageRange: { min: number; max: number }
  participants: number
  difficulty: string
  tone: string
  adventureType: string
  place: string
  materials: string[]
  introduction: {
    story: string
    setupForParents: string
  }
  missions: Array<{
    order: number
    title: string
    story: string
  }>
}

export interface TemplateListItem {
  id: string
  title: string
  estimatedDurationMinutes: number
  ageRange: { min: number; max: number }
  image?: { url: string }
}

export function listTemplates(): TemplateListItem[] {
  return (templates as TemplateJSON[]).map((template) => ({
    id: template.id,
    title: template.title,
    estimatedDurationMinutes: template.estimatedDurationMinutes,
    ageRange: template.ageRange,
    image: template.imageUrl ? { url: template.imageUrl } : undefined,
  }))
}
