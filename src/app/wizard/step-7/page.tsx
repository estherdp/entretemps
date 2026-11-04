'use client'

import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { OptionTile } from '@/ui/components/option-tile'

import type { Difficulty } from '@/domain/wizard-data'
import { useWizard } from '@/ui/wizard/wizard-provider'

const OPTIONS: { value: Difficulty; label: string; subtitle: string }[] = [
  { value: 'easy', label: 'Fácil', subtitle: '3 misiones · retos sencillos' },
  { value: 'medium', label: 'Media', subtitle: '4 misiones · hay que pensar' },
  { value: 'hard', label: 'Desafiante', subtitle: '5 misiones · para expertos' },
]

export default function Step7Page() {
  const { wizardData, setWizardData } = useWizard()
  const selected = wizardData.difficulty || null

  return (
    <WizardShell
      currentStep={7}
      totalSteps={8}
      prevHref="/wizard/step-6"
      nextHref="/wizard/step-8"
      nextDisabled={!selected}
      validationMessage={!selected ? 'Selecciona un nivel de dificultad' : undefined}
    >
      <WizardStepCard
        title="Nivel de dificultad"
        description="Los retos se adaptarán al nivel que elijas."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {OPTIONS.map((option, index) => (
            <OptionTile
              key={option.value}
              index={index}
              label={option.label}
              subtitle={option.subtitle}
              selected={selected === option.value}
              onSelect={() => setWizardData({ difficulty: option.value })}
            />
          ))}
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
