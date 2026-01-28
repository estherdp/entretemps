import templates from '@/data/templates/examples.json'
import { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

export interface TemplateListItem {
  id: string
  title: string
  estimatedDurationMinutes: number
  ageRange: { min: number; max: number }
  image?: { url: string }
}

export function listTemplates(): TemplateListItem[] {
  return templates.map((template) => ({
    id: template.id,
    title: template.title,
    estimatedDurationMinutes: template.estimatedDurationMinutes,
    ageRange: template.ageRange,
    image: undefined, // Las plantillas no tienen imagen
  }))
}
