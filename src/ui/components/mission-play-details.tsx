// src/ui/components/mission-play-details.tsx

import type { GeneratedAdventurePackMission, MissionChallengeType } from '@/domain/generated-adventure-pack'

const CHALLENGE_LABELS: Record<MissionChallengeType, string> = {
  riddle: 'Acertijo',
  puzzle: 'Puzzle',
  search: 'Búsqueda',
  physical: 'Prueba física',
  creative: 'Reto creativo',
  cipher: 'Mensaje cifrado',
}

interface MissionPlayDetailsProps {
  mission: GeneratedAdventurePackMission
}

/**
 * Muestra los elementos jugables de una misión: reto, pistas,
 * tarjetas imprimibles, materiales y adaptaciones por edad.
 *
 * No renderiza nada para misiones antiguas que no tienen estos campos.
 */
export function MissionPlayDetails({ mission }: MissionPlayDetailsProps) {
  const { challenge, hints, clueCards, materials, ageAdaptations, estimatedMinutes } = mission

  if (!challenge && !hints?.length && !clueCards?.length && !ageAdaptations) {
    return null
  }

  return (
    <div className="space-y-4">
      {challenge && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
          <p className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-100">
            <span>🧩 Reto · {CHALLENGE_LABELS[challenge.type]}</span>
            {estimatedMinutes && <span className="font-medium normal-case">⏱️ {estimatedMinutes} min</span>}
          </p>
          <p className="text-sm leading-relaxed text-amber-950 dark:text-amber-100">{challenge.description}</p>
          <details className="mt-3 text-sm text-amber-900 dark:text-amber-200">
            <summary className="cursor-pointer font-semibold">Ver solución</summary>
            <p className="mt-1">{challenge.solution}</p>
          </details>
        </div>
      )}

      {hints && hints.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">💡 Pistas (de menos a más)</p>
          <ol className="list-decimal space-y-1 pl-6 text-sm leading-relaxed">
            {hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ol>
        </div>
      )}

      {clueCards && clueCards.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">✂️ Tarjetas para imprimir y esconder</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {clueCards.map((card, index) => (
              <div key={index} className="rounded-xl border-2 border-dashed border-border p-4 break-inside-avoid">
                <p className="text-sm font-medium leading-relaxed">{card.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">📍 Esconder: {card.hidingSpot}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {materials && materials.length > 0 && (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">📦 Para esta misión:</span> {materials.join(', ')}
        </p>
      )}

      {ageAdaptations && (
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-muted/60 p-3">
            <p className="mb-1 font-semibold">🐣 Para los más pequeños</p>
            <p className="leading-relaxed text-muted-foreground">{ageAdaptations.younger}</p>
          </div>
          <div className="rounded-xl bg-muted/60 p-3">
            <p className="mb-1 font-semibold">🦉 Para los mayores</p>
            <p className="leading-relaxed text-muted-foreground">{ageAdaptations.older}</p>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Versión en texto plano de los elementos jugables (para copiar al portapapeles).
 */
export function missionPlayDetailsToText(mission: GeneratedAdventurePackMission): string {
  const lines: string[] = []

  if (mission.challenge) {
    lines.push(`🧩 Reto (${CHALLENGE_LABELS[mission.challenge.type]}): ${mission.challenge.description}`)
    lines.push(`   Solución: ${mission.challenge.solution}`)
  }
  if (mission.hints?.length) {
    lines.push('💡 Pistas:', ...mission.hints.map((hint, i) => `   ${i + 1}. ${hint}`))
  }
  if (mission.clueCards?.length) {
    lines.push('✂️ Tarjetas:', ...mission.clueCards.map((card) => `   • "${card.text}" (esconder: ${card.hidingSpot})`))
  }
  if (mission.ageAdaptations) {
    lines.push(`🐣 Pequeños: ${mission.ageAdaptations.younger}`, `🦉 Mayores: ${mission.ageAdaptations.older}`)
  }

  return lines.join('\n')
}
