'use client'

import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Cake, Users, PartyPopper, Mountain, LucideIcon } from 'lucide-react'
import { OptionTile } from '@/ui/components/option-tile'
import { validateStep1 } from '@/application/validate-wizard-step'

import type { Occasion } from '@/domain/wizard-data'
import { useWizard } from '@/ui/wizard/wizard-provider'

const OPTIONS: { value: Occasion; label: string; icon: LucideIcon }[] = [
  { value: 'birthday', label: 'Cumpleaños', icon: Cake },
  { value: 'family-afternoon', label: 'Tarde en familia', icon: Users },
  { value: 'party', label: 'Fiesta', icon: PartyPopper },
  { value: 'excursion', label: 'Excursión', icon: Mountain },
]
  
export default function Step1Page() {
  const {wizardData, setWizardData} = useWizard()
  const selected = wizardData.occasion || null
  const validation = validateStep1(wizardData)

  return (
    <WizardShell
      currentStep={1}
      totalSteps={8}
      nextHref="/wizard/step-2"
      nextDisabled={!validation.isValid}
      validationMessage={!validation.isValid ? validation.message : undefined}
    >
      <WizardStepCard
        title="¿Qué ocasión celebráis?"
        description="Selecciona el tipo de evento para personalizar la aventura."
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {OPTIONS.map((option, index) => (
            <OptionTile
              key={option.value}
              index={index}
              label={option.label}
              icon={option.icon}
              selected={selected === option.value}
              onSelect={() => setWizardData({ occasion: option.value })}
            />
          ))}
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
