'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card'
import { Button } from '@/ui/components/button'
import { Copy, Check, Sparkles, Clock, Users, Target, Package } from 'lucide-react'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import {
  ADVENTURE_TYPE_LABELS,
  TONE_LABELS,
  DIFFICULTY_LABELS,
  PLACE_LABELS,
} from '@/ui/wizard/labels'
import { useSaveAdventurePack } from '@/ui/hooks/use-save-adventure-pack'

export default function PackResultPage() {
  const router = useRouter()
  const [pack, setPack] = useState<GeneratedAdventurePack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const { save, isSaving, saved, error: saveError } = useSaveAdventurePack()

  useEffect(() => {
    const stored = sessionStorage.getItem('generated-adventure-pack')
    if (stored) {
      setPack(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const handleSave = async () => {
    if (!pack) return

    const success = await save(pack)
    if (!success && saveError?.includes('iniciar sesión')) {
      router.push('/login')
    }
  }

  const handleCopy = async () => {
    if (!pack) return

    // Formatear el texto completo de la aventura
    const fullText = `
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
${pack.materials.map(m => `• ${m}`).join('\n')}

🎯 MISIONES

${pack.missions.sort((a, b) => a.order - b.order).map(m => `
MISIÓN ${m.order}: ${m.title}

📖 Historia:
${m.story}

👥 Guía para padres:
${m.parentGuide}

✅ Misión completada cuando: ${m.successCondition}
`).join('\n')}

🎉 FINAL DE LA AVENTURA
${pack.conclusion.story}

💫 Tip de celebración:
${pack.conclusion.celebrationTip}

---
Creado con Entretemps el ${new Date(pack.createdAt).toLocaleDateString('es-ES')}
    `.trim()

    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error al copiar:', error)
    }
  }

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
          <Image
            src={pack.image.url}
            alt={pack.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-2 p-6">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground">{pack.title}</h1>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Premium Layout */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {/* Header con icono mágico */}
        <div className="space-y-6">
          {pack.image.url && (
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-premium">
                <Sparkles className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                  {pack.title}
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Tu aventura personalizada está lista
                </p>
              </div>
            </div>
          )}

          {/* Key Info - Grid Premium */}
          <Card className="rounded-2xl shadow-premium-lg border-border/60 overflow-hidden">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" strokeWidth={1.5} />
                    <p className="text-xs uppercase tracking-wider font-medium">Edades</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {pack.ageRange.min}-{pack.ageRange.max}
                    <span className="text-sm font-normal text-muted-foreground ml-1">años</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    <p className="text-xs uppercase tracking-wider font-medium">Duración</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {pack.estimatedDurationMinutes}
                    <span className="text-sm font-normal text-muted-foreground ml-1">min</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" strokeWidth={1.5} />
                    <p className="text-xs uppercase tracking-wider font-medium">Participantes</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {pack.participants}
                    <span className="text-sm font-normal text-muted-foreground ml-1">niños</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="w-4 h-4" strokeWidth={1.5} />
                    <p className="text-xs uppercase tracking-wider font-medium">Dificultad</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{DIFFICULTY_LABELS[pack.difficulty]}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border/60 flex flex-wrap gap-3">
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  {ADVENTURE_TYPE_LABELS[pack.adventureType]}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border/60">
                  {TONE_LABELS[pack.tone]}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium border border-border/60">
                  {PLACE_LABELS[pack.place]}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Introduction - Premium */}
        <Card className="rounded-2xl shadow-premium-lg border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl">📖 La Aventura Comienza</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed text-foreground/90">
              {pack.introduction.story}
            </p>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border border-amber-200/60 dark:border-amber-800/60 rounded-2xl p-6 shadow-premium">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                <span className="text-lg">💡</span>
                Guía para padres
              </p>
              <p className="text-sm text-amber-900/80 dark:text-amber-200/90 leading-relaxed">
                {pack.introduction.setupForParents}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Materials - Premium */}
        {pack.materials.length > 0 && (
          <Card className="rounded-2xl shadow-premium-lg border-border/60">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Package className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <CardTitle className="text-2xl">Materiales Necesarios</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pack.materials.map((material, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" strokeWidth={2} />
                    </div>
                    <span className="text-sm font-medium">{material}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Missions - Premium with Numbers */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" strokeWidth={1.5} />
            Misiones
          </h2>
          {pack.missions
            .sort((a, b) => a.order - b.order)
            .map((mission) => (
              <Card key={mission.order} className="rounded-2xl shadow-premium-lg border-border/60 overflow-hidden hover:shadow-premium-lg hover-lift">
                <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-md">
                      {mission.order}
                    </div>
                    <CardTitle className="text-2xl">{mission.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Story for kids */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <span className="text-base">📖</span>
                      Historia para los niños
                    </p>
                    <p className="text-base leading-relaxed text-foreground/90 pl-6 border-l-2 border-primary/30">
                      {mission.story}
                    </p>
                  </div>

                  {/* Parent Guide */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-200/60 dark:border-blue-800/60 rounded-2xl p-5 shadow-premium">
                    <p className="text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="text-base">👥</span>
                      Guía para padres
                    </p>
                    <p className="text-sm text-blue-900/80 dark:text-blue-200/90 leading-relaxed">
                      {mission.parentGuide}
                    </p>
                  </div>

                  {/* Success Condition */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border border-green-200/60 dark:border-green-800/60 rounded-2xl p-4 shadow-premium">
                    <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" strokeWidth={2} />
                      <span>
                        <span className="font-semibold">Misión completada cuando:</span>{' '}
                        {mission.successCondition}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Conclusion - Premium */}
        <Card className="rounded-2xl shadow-premium-lg border-border/60">
          <CardHeader>
            <CardTitle className="text-2xl">🎉 Final de la Aventura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed text-foreground/90">
              {pack.conclusion.story}
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border border-purple-200/60 dark:border-purple-800/60 rounded-2xl p-6 shadow-premium">
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                <span className="text-lg">💫</span>
                Tip de celebración
              </p>
              <p className="text-sm text-purple-900/80 dark:text-purple-200/90 leading-relaxed">
                {pack.conclusion.celebrationTip}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions - Premium con Copy Button */}
        <Card className="rounded-2xl shadow-premium-lg border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                onClick={handleCopy}
                variant="default"
                className="flex items-center gap-2 rounded-xl shadow-premium hover:shadow-premium-lg hover:scale-105 transition-all duration-200"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={2} />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" strokeWidth={1.5} />
                    Copiar texto
                  </>
                )}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || saved}
                variant={saved ? 'secondary' : 'default'}
                className="flex items-center gap-2 rounded-xl shadow-premium hover:shadow-premium-lg hover:scale-105 transition-all duration-200"
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={2} />
                    Guardado
                  </>
                ) : isSaving ? (
                  'Guardando...'
                ) : (
                  'Guardar'
                )}
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="flex items-center gap-2 rounded-xl border-border/60 hover:border-primary/40 hover:shadow-premium hover:scale-105 transition-all duration-200"
              >
                Imprimir
              </Button>
              <Button
                onClick={() => router.push('/wizard/step-1')}
                variant="outline"
                className="flex items-center gap-2 rounded-xl border-border/60 hover:border-primary/40 hover:shadow-premium hover:scale-105 transition-all duration-200"
              >
                Nueva aventura
              </Button>
            </div>
            {saveError && (
              <p className="text-sm text-destructive text-center mt-4 p-3 rounded-xl bg-destructive/10">
                {saveError}
              </p>
            )}
          </CardContent>
        </Card>

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
