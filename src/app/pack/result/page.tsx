'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card'
import { Button } from '@/ui/components/button'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import {
  ADVENTURE_TYPE_LABELS,
  TONE_LABELS,
  DIFFICULTY_LABELS,
  PLACE_LABELS,
} from '@/ui/wizard/labels'

export default function PackResultPage() {
  const router = useRouter()
  const [pack, setPack] = useState<GeneratedAdventurePack | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('generated-adventure-pack')
    if (stored) {
      setPack(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando aventura...</p>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">No se encontró ninguna aventura generada.</p>
        <Button onClick={() => router.push('/wizard/step-1')}>Crear nueva aventura</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Image */}
      <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden">
        {pack.image.url ? (
          <img
            src={pack.image.url}
            alt={pack.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-2 p-6">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground">{pack.title}</h1>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          {pack.image.url && (
            <h1 className="text-3xl md:text-4xl font-bold">{pack.title}</h1>
          )}

          {/* Key Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Edades</p>
                  <p className="font-semibold">{pack.ageRange.min}-{pack.ageRange.max} años</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Duración</p>
                  <p className="font-semibold">{pack.estimatedDurationMinutes} min</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Participantes</p>
                  <p className="font-semibold">{pack.participants} niños</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Dificultad</p>
                  <p className="font-semibold">{DIFFICULTY_LABELS[pack.difficulty]}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Tipo</p>
                  <p className="font-semibold">{ADVENTURE_TYPE_LABELS[pack.adventureType]}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Tono</p>
                  <p className="font-semibold">{TONE_LABELS[pack.tone]}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Lugar</p>
                  <p className="font-semibold">{PLACE_LABELS[pack.place]}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>La Aventura Comienza</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed">{pack.introduction.story}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
                💡 Guía para padres
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                {pack.introduction.setupForParents}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Materials */}
        {pack.materials.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Materiales Necesarios</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {pack.materials.map((material, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span className="text-sm">{material}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Missions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Misiones</h2>
          {pack.missions
            .sort((a, b) => a.order - b.order)
            .map((mission) => (
              <Card key={mission.order} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                      {mission.order}
                    </div>
                    <CardTitle className="text-xl">{mission.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Story for kids */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      📖 Historia
                    </p>
                    <p className="text-base leading-relaxed">{mission.story}</p>
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
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Conclusion */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Final de la Aventura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed">{pack.conclusion.story}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
                🎉 Tip de celebración
              </p>
              <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                {pack.conclusion.celebrationTip}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            onClick={() => router.push('/wizard/step-1')}
            variant="outline"
            className="flex-1"
          >
            Crear nueva aventura
          </Button>
          <Button
            onClick={() => window.print()}
            className="flex-1"
          >
            Imprimir Pack
          </Button>
        </div>

        {/* Footer Info */}
        <p className="text-xs text-center text-muted-foreground pt-4">
          Pack creado el {new Date(pack.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  )
}
