'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Card, CardContent } from '@/ui/components/card'

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

  return (
    <WizardShell
      currentStep={8}
      totalSteps={8}
      prevHref="/wizard/step-7"
      nextLabel={isLoading ? 'Generando...' : 'Generar aventura'}
      nextDisabled={isLoading}
      onNext={handleGenerate}
    >
      <WizardStepCard
        title="Resumen de tu aventura"
        description="Revisa los datos antes de generar tu Pack de Aventura."
      >
        <div className="space-y-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-3 text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-muted-foreground">Ocasión:</span>
                <span className="font-medium">
                  {wizardData.occasion ? OCCASION_LABELS[wizardData.occasion] : '—'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-muted-foreground">Edades:</span>
                <span className="font-medium">
                  {wizardData.ages ? `${wizardData.ages.min} - ${wizardData.ages.max} años` : '—'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-muted-foreground">Niños:</span>
                <span className="font-medium">
                  {wizardData.kidsCount ? `${wizardData.kidsCount} participantes` : '—'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-muted-foreground">Tema:</span>
                <span className="font-medium">{wizardData.interests || '—'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-muted-foreground">Lugar:</span>
                <span className="font-medium">
                  {wizardData.place ? PLACE_LABELS[wizardData.place] : '—'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-muted-foreground">Tipo de aventura:</span>
                <span className="font-medium">
                  {wizardData.adventureType ? ADVENTURE_TYPE_LABELS[wizardData.adventureType] : '—'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-muted-foreground">Tono de la historia:</span>
                <span className="font-medium">
                  {wizardData.tone ? TONE_LABELS[wizardData.tone] : '—'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-muted-foreground">Dificultad:</span>
                <span className="font-medium">
                  {wizardData.difficulty ? DIFFICULTY_LABELS[wizardData.difficulty] : '—'}
                </span>
              </div>
            </CardContent>
          </Card>

          {message && (
            <div
              className={`p-4 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
