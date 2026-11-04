'use client'

import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Home, Flower2, Trees, Building, Compass, LucideIcon } from 'lucide-react'
import { OptionTile } from '@/ui/components/option-tile'
import { validateStep4 } from '@/application/validate-wizard-step'

import type { Place } from '@/domain/wizard-data'
import { useWizard } from '@/ui/wizard/wizard-provider'

const OPTIONS :{ value: Place; label: string; subtitle: string; icon: LucideIcon }[] = [
  { value: 'home', label: 'Casa', subtitle: 'Interior del hogar', icon: Home },
  { value: 'garden', label: 'Jardín', subtitle: 'Terraza o patio', icon: Flower2 },
  { value: 'park', label: 'Parque', subtitle: 'Espacio al aire libre', icon: Trees },
  { value: 'indoor', label: 'Interior', subtitle: 'Ludoteca o local', icon: Building },
  { value: 'outdoor', label: 'Exterior', subtitle: 'Excursión', icon: Compass },
]

export default function Step4Page() {
  const {wizardData, setWizardData} = useWizard()
  const selected = wizardData.place || null
  const validation = validateStep4(wizardData)

  return (
    <WizardShell
      currentStep={4}
      totalSteps={8}
      prevHref="/wizard/step-3"
      nextHref="/wizard/step-5"
      nextDisabled={!validation.isValid}
      validationMessage={!validation.isValid ? validation.message : undefined}
    >
      <WizardStepCard
        title="¿Dónde será la aventura?"
        description="El lugar determina qué tipo de retos y escondites podemos sugerir."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {OPTIONS.map((option, index) => (
            <OptionTile
              key={option.value}
              index={index}
              label={option.label}
              subtitle={option.subtitle}
              icon={option.icon}
              selected={selected === option.value}
              onSelect={() => setWizardData({ place: option.value })}
            />
          ))}
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
