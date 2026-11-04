import type { ITemplateRepository } from '@/domain/repositories'
import type { AdventureType, Difficulty, Place } from '@/domain/wizard-data'

/** Datos mínimos de una plantilla para pintarla en un listado. */
export interface TemplateListItem {
  id: string
  title: string
  estimatedDurationMinutes: number
  ageRange: { min: number; max: number }
  adventureType: AdventureType
  place: Place
  difficulty: Difficulty
}

export function listTemplates(repository: ITemplateRepository): TemplateListItem[] {
  return repository.list().map((template) => ({
    id: template.id,
    title: template.title,
    estimatedDurationMinutes: template.estimatedDurationMinutes,
    ageRange: template.ageRange,
    adventureType: template.adventureType,
    place: template.place,
    difficulty: template.difficulty,
  }))
}
