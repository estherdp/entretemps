'use client'

import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Label } from '@/ui/components/label'
import { Input } from '@/ui/components/input'
import { validateStep2 } from '@/application/validate-wizard-step'

import {useWizard} from '@/ui/wizard/wizard-provider'

export default function Step2Page() {
  const {wizardData, setWizardData} = useWizard()
  const ageMin = wizardData.ages?.min ?? ''
  const ageMax = wizardData.ages?.max ?? ''
  const numChildren = wizardData.kidsCount ?? ''
  const validation = validateStep2(wizardData)

  return (
    <WizardShell
      currentStep={2}
      totalSteps={8}
      prevHref="/wizard/step-1"
      nextHref="/wizard/step-3"
      nextDisabled={!validation.isValid}
      validationMessage={!validation.isValid ? validation.message : undefined}
    >
      <WizardStepCard
        title="¿Qué edades tienen los niños?"
        description="Indica las edades para adaptar la dificultad de los retos."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="age-min">Edad mínima</Label>
            <Input
              id="age-min"
              type="number"
              placeholder="Ej: 5"
              min={3}
              max={16}
              className="h-12"
              value={ageMin}
              onChange={(e) => {
                const min = Number(e.target.value)
                setWizardData({
                  ages: {
                    min,
                    max: wizardData.ages?.max ?? min,
                  },
                })
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age-max">Edad máxima</Label>
            <Input
              id="age-max"
              type="number"
              placeholder="Ej: 10"
              min={3}
              max={16}
              className="h-12"
              value={ageMax}
              onChange={(e) => {
                const max = Number(e.target.value)
                setWizardData({
                  ages: {
                    min: wizardData.ages?.min ?? max,
                    max,
                  },
                })
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="num-children">Número de niños</Label>
            <Input
              id="num-children"
              type="number"
              placeholder="Ej: 4"
              min={1}
              max={20}
              className="h-12"
              value={numChildren}
              onChange={(e) => {
                setWizardData({ kidsCount: Number(e.target.value) })
              }}
            />
          </div>
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
