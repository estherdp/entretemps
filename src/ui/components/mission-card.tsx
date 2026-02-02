// src/ui/components/mission-card.tsx

'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card'
import { Button } from '@/ui/components/button'
import { Textarea } from '@/ui/components/textarea'
import { Skeleton } from '@/ui/components/skeleton'
import { GripVertical, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import type { GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'

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
    <Card
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden ${isDragging ? 'shadow-2xl ring-2 ring-primary' : ''} ${
        isRegenerating ? 'animate-pulse' : ''
      }`}
    >
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Drag Handle */}
          {isEditing && !isDragDisabled && (
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-primary/20 rounded transition-colors flex-shrink-0"
              aria-label="Drag to reorder"
              disabled={isRegenerating}
            >
              <GripVertical className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </button>
          )}

          {/* Mission Number Badge */}
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary text-primary-foreground font-bold text-sm md:text-base flex-shrink-0">
            {mission.order}
          </div>

          {/* Mission Title */}
          <CardTitle className="text-base md:text-xl flex-1 min-w-0 line-clamp-2">
            {mission.title}
          </CardTitle>

          {/* Expand/Collapse Button */}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
            className="flex-shrink-0 p-2"
            aria-label={isExpanded ? 'Contraer' : 'Expandir'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>
      </CardHeader>

      {/* Collapsible Content */}
      {isExpanded && (
        <CardContent className="pt-6 space-y-4">
          {/* Regenerate Button - Inside accordion, in edit mode */}
          {isEditing && (
            <div className="flex justify-end">
              <Button
                onClick={onRegenerate}
                disabled={isRegenerating}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Regenerando...' : 'Regenerar'}
              </Button>
            </div>
          )}

          {/* Loading Skeleton during regeneration */}
          {isRegenerating ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-16 w-full" />
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ) : (
            <>
              {/* Story for kids */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  📖 Historia
                </p>
                {isEditing ? (
                  <Textarea
                    value={missionStory}
                    onChange={(e) => onStoryChange(e.target.value)}
                    className="min-h-32"
                    placeholder={`Historia de la misión ${mission.order}...`}
                  />
                ) : (
                  <p className="text-base leading-relaxed">{mission.story}</p>
                )}
              </div>

              {/* Parent Guide */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 uppercase tracking-wide">
                  👥 Guía para padres
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  {mission.parentGuide}
                </p>
              </div>

              {/* Success Condition */}
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                  <span className="font-semibold">✅ Misión completada cuando:</span>{' '}
                  {mission.successCondition}
                </p>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  )
}
