'use client'

import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Laugh, Search, Flame, Moon, type LucideIcon } from 'lucide-react'
import { OptionTile } from '@/ui/components/option-tile'

import type { Tone } from '@/domain/wizard-data'
import { useWizard } from '@/ui/wizard/wizard-provider'

const OPTIONS: { value: Tone; label: string; subtitle: string; icon: LucideIcon }[] = [
  { value: 'funny', label: 'Divertida', subtitle: 'Risas aseguradas', icon: Laugh },
  { value: 'enigmatic', label: 'Enigmática', subtitle: 'Secretos y pistas', icon: Search },
  { value: 'exciting', label: 'Emocionante', subtitle: 'Ritmo trepidante', icon: Flame },
  { value: 'calm', label: 'Tranquila', subtitle: 'Para ir sin prisa', icon: Moon },
]

export default function Step6Page() {
  const { wizardData, setWizardData } = useWizard()
  const selected = wizardData.tone || null

  return (
    <WizardShell
      currentStep={6}
      totalSteps={8}
      prevHref="/wizard/step-5"
      nextHref="/wizard/step-7"
      nextDisabled={!selected}
      validationMessage={!selected ? 'Selecciona un tono para la historia' : undefined}
    >
      <WizardStepCard
        title="Tono de la historia"
        description="Define el ambiente y sensación de tu aventura."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {OPTIONS.map((option, index) => (
            <OptionTile
              key={option.value}
              index={index}
              label={option.label}
              subtitle={option.subtitle}
              icon={option.icon}
              selected={selected === option.value}
              onSelect={() => setWizardData({ tone: option.value })}
            />
          ))}
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
