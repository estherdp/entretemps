// src/ui/components/mission-play-details.tsx

import type { GeneratedAdventurePackMission, MissionChallengeType } from '@/domain/generated-adventure-pack'
import { cn } from '@/lib/utils'

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
    <div className="space-y-5">
      {challenge && (
        <div className="print-avoid-break rounded-xl border-2 border-ink bg-card p-4 shadow-sticker-sm">
          <p className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full border-2 border-ink bg-sun px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
              Reto · {CHALLENGE_LABELS[challenge.type]}
            </span>
            {estimatedMinutes && <span className="text-sm font-bold text-ink-soft">⏱ {estimatedMinutes} min</span>}
          </p>
          <p className="leading-relaxed">{challenge.description}</p>
          <details className="group mt-3 rounded-lg bg-paper-deep/60 px-3 py-2 text-[0.95rem]">
            <summary className="cursor-pointer font-bold text-forest marker:text-forest">Ver solución</summary>
            <p className="mt-1 leading-relaxed">{challenge.solution}</p>
          </details>
        </div>
      )}

      {hints && hints.length > 0 && (
        <div className="space-y-2">
          <p className="font-hand text-xl leading-none">Pistas, de menos a más</p>
          <ol className="space-y-1.5">
            {hints.map((hint, index) => (
              <li key={index} className="flex gap-3 leading-relaxed">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper text-xs font-bold">
                  {index + 1}
                </span>
                <span>{hint}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {clueCards && clueCards.length > 0 && (
        <div className="space-y-3">
          <p className="font-hand text-xl leading-none">✂ Tarjetas para recortar y esconder</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {clueCards.map((card, index) => (
              <div key={index} className={cn('ticket p-4', index % 2 ? 'rotate-[0.6deg]' : '-rotate-[0.6deg]')}>
                <p className="font-hand text-lg leading-none text-tomato">Pista nº {index + 1}</p>
                <p className="mt-1.5 font-display text-lg leading-snug">«{card.text}»</p>
                <p className="mt-3 border-t-2 border-dashed border-ink/20 pt-2 text-xs font-bold text-ink-soft">
                  📍 Esconder: {card.hidingSpot}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {materials && materials.length > 0 && (
        <p className="text-[0.95rem] text-ink-soft">
          <span className="font-bold text-ink">Para esta misión:</span> {materials.join(', ')}
        </p>
      )}

      {ageAdaptations && (
        <div className="grid gap-3 text-[0.95rem] sm:grid-cols-2">
          <div className="rounded-xl border-2 border-ink/15 bg-paper p-3">
            <p className="mb-1 font-bold">🐣 Para los más pequeños</p>
            <p className="leading-relaxed text-ink-soft">{ageAdaptations.younger}</p>
          </div>
          <div className="rounded-xl border-2 border-ink/15 bg-paper p-3">
            <p className="mb-1 font-bold">🦉 Para los mayores</p>
            <p className="leading-relaxed text-ink-soft">{ageAdaptations.older}</p>
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
