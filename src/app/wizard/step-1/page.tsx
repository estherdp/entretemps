'use client'

import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Cake, Users, PartyPopper, Mountain, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { validateStep1 } from '@/application/validate-wizard-step'

import type { Occasion } from '@/domain/wizard-data'
import { useWizard } from '@/ui/wizard/wizard-provider'

const OCCASION_OPTIONS: { value: Occasion; label: string; icon: LucideIcon }[] = [
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {OCCASION_OPTIONS.map((option) => {
            const isSelected = selected === option.value
            const Icon = option.icon

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setWizardData({ occasion: option.value })}
                className={cn(
                  'group flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all duration-200',
                  'hover:scale-105 hover:border-primary/60 hover:shadow-premium-lg',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                  'active:scale-95',
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-premium-lg shadow-primary/15'
                    : 'border-border bg-card shadow-premium hover:bg-primary/5'
                )}
                aria-pressed={isSelected}
              >
                <div
                  className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200',
                    'group-hover:scale-110',
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  )}
                >
                  <Icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <span
                  className={cn(
                    'text-sm font-semibold text-center transition-colors',
                    isSelected ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
