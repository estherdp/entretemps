'use client'

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

export default function Step6Page() {
  const { wizardData } = useWizard()

  return (
    <WizardShell
      currentStep={6}
      totalSteps={6}
      prevHref="/wizard/step-5"
      nextLabel="Generar aventura"
      nextDisabled={true}
    >
      <WizardStepCard
        title="Resumen de tu aventura"
        description="Revisa los datos antes de generar tu Pack de Aventura."
      >
        <div className="space-y-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ocasión:</span>
                <span className="font-medium">
                  {wizardData.occasion ? OCCASION_LABELS[wizardData.occasion] : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Edades:</span>
                <span className="font-medium">
                  {wizardData.ages ? `${wizardData.ages.min} - ${wizardData.ages.max} años` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Niños:</span>
                <span className="font-medium">
                  {wizardData.kidsCount ? `${wizardData.kidsCount} participantes` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tema:</span>
                <span className="font-medium">{wizardData.interests || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lugar:</span>
                <span className="font-medium">
                  {wizardData.place ? PLACE_LABELS[wizardData.place] : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo de aventura:</span>
                <span className="font-medium">
                  {wizardData.adventureType ? ADVENTURE_TYPE_LABELS[wizardData.adventureType] : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tono de la historia:</span>
                <span className="font-medium">
                  {wizardData.tone ? TONE_LABELS[wizardData.tone] : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dificultad:</span>
                <span className="font-medium">
                  {wizardData.difficulty ? DIFFICULTY_LABELS[wizardData.difficulty] : '—'}
                </span>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            El botón estará activo cuando se implemente la generación con IA.
          </p>
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
