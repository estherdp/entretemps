// src/ui/components/mission-card.tsx

'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/ui/components/button'
import { Textarea } from '@/ui/components/textarea'
import { Skeleton } from '@/ui/components/skeleton'
import { GripVertical, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import type { GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'
import { MissionBody, MissionStamp, ReadAloud } from '@/ui/components/adventure-sections'
import { cn } from '@/lib/utils'

interface MissionCardProps {
  mission: GeneratedAdventurePackMission
  isEditing: boolean
  isRegenerating: boolean
  missionStory: string
  onStoryChange: (story: string) => void
  onRegenerate: () => void
  isDragDisabled?: boolean
}

/**
 * Componente de tarjeta de misión con soporte para Drag & Drop.
 *
 * Características:
 * - Drag handle con icono GripVertical para reordenar
 * - Botón de regeneración con estado de carga
 * - Edición inline de la historia de la misión
 * - Skeleton loader durante regeneración
 * - Transiciones suaves al reordenar
 */
export function MissionCard({
  mission,
  isEditing,
  isRegenerating,
  missionStory,
  onStoryChange,
  onRegenerate,
  isDragDisabled = false,
}: MissionCardProps) {
  // Estado local para el acordeón
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: mission.order,
    disabled: isDragDisabled || !isEditing || isRegenerating,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        'sticker overflow-hidden',
        isDragging && 'shadow-sticker-lg ring-4 ring-sun',
        isRegenerating && 'animate-pulse'
      )}
    >
      <div className="flex items-center gap-3 p-4 md:gap-4 md:p-5">
        {isEditing && !isDragDisabled && (
          <button
            {...attributes}
            {...listeners}
            className="shrink-0 cursor-grab rounded-lg border-2 border-dashed border-ink/40 p-1.5 transition-colors hover:bg-sun/30 active:cursor-grabbing"
            aria-label="Drag to reorder"
            disabled={isRegenerating}
          >
            <GripVertical className="h-5 w-5" />
          </button>
        )}

        <MissionStamp order={mission.order} className="h-12 w-12 text-2xl" />

        <h3 className="min-w-0 flex-1 text-balance text-xl leading-tight md:text-2xl">{mission.title}</h3>

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          size="sm"
          className="no-print shrink-0 px-2"
          aria-label={isExpanded ? 'Contraer' : 'Expandir'}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-4 border-t-2 border-dashed border-ink/25 p-4 md:p-6">
          {isEditing && (
            <div className="flex justify-end">
              <Button onClick={onRegenerate} disabled={isRegenerating} variant="secondary" size="sm">
                <RefreshCw className={cn(isRegenerating && 'animate-spin')} />
                {isRegenerating ? 'Regenerando...' : 'Regenerar'}
              </Button>
            </div>
          )}

          {isRegenerating ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-24 bg-paper-deep" />
              <Skeleton className="h-24 w-full bg-paper-deep" />
              <Skeleton className="h-16 w-full bg-paper-deep" />
              <Skeleton className="h-12 w-full bg-paper-deep" />
            </div>
          ) : (
            <MissionBody
              mission={mission}
              story={
                isEditing ? (
                  <Textarea
                    value={missionStory}
                    onChange={(e) => onStoryChange(e.target.value)}
                    className="min-h-32 text-base"
                    placeholder={`Historia de la misión ${mission.order}...`}
                  />
                ) : (
                  <ReadAloud>{missionStory || mission.story}</ReadAloud>
                )
              }
            />
          )}
        </div>
      )}
    </article>
  )
}
