'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { SkeletonLoader } from '@/ui/components/skeleton-loader'

import { useWizard } from '@/ui/wizard/wizard-provider'
import {
  OCCASION_LABELS,
  PLACE_LABELS,
  ADVENTURE_TYPE_LABELS,
  TONE_LABELS,
  DIFFICULTY_LABELS,
} from '@/ui/wizard/labels'

export default function Step8Page() {
  const router = useRouter()
  const { wizardData } = useWizard()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Llamar al API route que maneja la generación server-side
      const response = await fetch('/api/generate-adventure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wizardData),
      })

      const result = await response.json()

      if (result.ok && result.pack) {
        sessionStorage.setItem('generated-adventure-pack', JSON.stringify(result.pack))
        router.push('/pack/result')
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Error al generar la aventura.',
        })
        setIsLoading(false)
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      })
      setIsLoading(false)
    }
  }

  const summary: [string, string][] = [
    ['Ocasión', wizardData.occasion ? OCCASION_LABELS[wizardData.occasion] : '—'],
    ['Edades', wizardData.ages ? `${wizardData.ages.min} - ${wizardData.ages.max} años` : '—'],
    ['Niños', wizardData.kidsCount ? `${wizardData.kidsCount} participantes` : '—'],
    ['Tema', wizardData.interests || '—'],
    ['Lugar', wizardData.place ? PLACE_LABELS[wizardData.place] : '—'],
    ['Tipo de aventura', wizardData.adventureType ? ADVENTURE_TYPE_LABELS[wizardData.adventureType] : '—'],
    ['Tono', wizardData.tone ? TONE_LABELS[wizardData.tone] : '—'],
    ['Dificultad', wizardData.difficulty ? DIFFICULTY_LABELS[wizardData.difficulty] : '—'],
  ]

  // Mostrar skeleton loader elegante durante la generación
  if (isLoading) {
    return <SkeletonLoader message="Creando tu aventura personalizada..." />
  }

  return (
    <WizardShell
      currentStep={8}
      totalSteps={8}
      prevHref="/wizard/step-7"
      nextLabel="¡Generar aventura!"
      onNext={handleGenerate}
    >
      <WizardStepCard
        badge="Último paso"
        title="Resumen de tu aventura"
        description="Revisa los datos antes de generar tu Pack de Aventura."
      >
        <div className="space-y-5">
          <dl className="grid gap-x-8 sm:grid-cols-2">
            {summary.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 border-b-2 border-dashed border-ink/20 py-3">
                <dt className="font-hand text-xl text-ink-soft">{label}</dt>
                <dd className="text-right font-bold">{value}</dd>
              </div>
            ))}
          </dl>

          {message && (
            <p
              role="alert"
              className={
                message.type === 'success'
                  ? 'rounded-xl border-2 border-forest bg-forest/10 px-4 py-3 text-sm font-bold text-forest'
                  : 'rounded-xl border-2 border-tomato bg-tomato/10 px-4 py-3 text-sm font-bold text-tomato'
              }
            >
              {message.text}
            </p>
          )}
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
