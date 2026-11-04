// src/ui/adventure-plain-text.ts
//
// Versión en texto plano de un pack (para copiar al portapapeles y pegar
// en WhatsApp, notas, etc.).

import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import { missionPlayDetailsToText } from '@/ui/components/mission-play-details'
import { ADVENTURE_TYPE_LABELS, DIFFICULTY_LABELS, PLACE_LABELS, TONE_LABELS } from '@/ui/wizard/labels'

export function adventurePackToText(pack: GeneratedAdventurePack): string {
  const missions = [...pack.missions]
    .sort((a, b) => a.order - b.order)
    .map(
      (m) => `
MISIÓN ${m.order}: ${m.title}

📖 Historia:
${m.story}

👥 Guía para padres:
${m.parentGuide}

✅ Misión completada cuando: ${m.successCondition}

${missionPlayDetailsToText(m)}
`
    )
    .join('\n')

  return `
🌟 ${pack.title}

📋 INFORMACIÓN
• Edades: ${pack.ageRange.min}-${pack.ageRange.max} años
• Duración: ${pack.estimatedDurationMinutes} minutos
• Participantes: ${pack.participants} niños
• Dificultad: ${DIFFICULTY_LABELS[pack.difficulty]}
• Tipo: ${ADVENTURE_TYPE_LABELS[pack.adventureType]}
• Tono: ${TONE_LABELS[pack.tone]}
• Lugar: ${PLACE_LABELS[pack.place]}

📖 LA AVENTURA COMIENZA
${pack.introduction.story}

💡 Guía para padres:
${pack.introduction.setupForParents}

📦 MATERIALES NECESARIOS
${pack.materials.map((m) => `• ${m}`).join('\n')}

🎯 MISIONES
${missions}

🎉 FINAL DE LA AVENTURA
${pack.conclusion.story}

💫 Tip de celebración:
${pack.conclusion.celebrationTip}

---
Creado con Entretemps el ${new Date(pack.createdAt).toLocaleDateString('es-ES')}
`.trim()
}
