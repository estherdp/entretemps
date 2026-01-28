import templates from '@/data/templates/examples.json'
import { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

export function getTemplateById(id: string): GeneratedAdventurePack | null {
  const template = templates.find((t) => t.id === id)

  if (!template) {
    return null
  }

  // Convertir la plantilla al formato GeneratedAdventurePack
  return {
    id: template.id,
    title: template.title,
    image: {
      url: '',
      prompt: '',
    },
    estimatedDurationMinutes: template.estimatedDurationMinutes,
    ageRange: template.ageRange,
    participants: template.participants,
    difficulty: template.difficulty,
    tone: template.tone,
    adventureType: template.adventureType,
    place: template.place,
    materials: template.materials,
    introduction: template.introduction,
    missions: template.missions.map((mission) => ({
      order: mission.order,
      title: mission.title,
      story: mission.story,
      parentGuide: 'Guía para esta misión en la plantilla.',
      successCondition: 'Completa la actividad descrita.',
    })),
    conclusion: {
      story: '¡Misión cumplida! Habéis completado con éxito esta aventura.',
      celebrationTip: 'Celebrad con una pequeña recompensa o merienda especial.',
    },
    createdAt: new Date().toISOString(),
  }
}
