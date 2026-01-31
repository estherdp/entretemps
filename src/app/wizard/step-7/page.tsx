'use client'

import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { cn } from '@/lib/utils'

import type { Difficulty } from '@/domain/wizard-data'
import { useWizard } from '@/ui/wizard/wizard-provider'

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Media' },
  { value: 'hard', label: 'Desafiante' },
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
        <div className="grid grid-cols-3 gap-3">
          {DIFFICULTY_OPTIONS.map((option) => {
            const isSelected = selected === option.value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setWizardData({ difficulty: option.value })}
                className={cn(
                  'px-2 sm:px-4 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all',
                  'border-2 break-words',
                  'hover:border-primary/50 hover:bg-primary/5',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-background text-foreground'
                )}
                aria-pressed={isSelected}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
