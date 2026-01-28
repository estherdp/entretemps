'use client'

import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Cake, Users, PartyPopper, Mountain, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  return (
    <WizardShell
      currentStep={1}
      totalSteps={6}
      nextHref="/wizard/step-2"
    >
      <WizardStepCard
        title="¿Qué ocasión celebráis?"
        description="Selecciona el tipo de evento para personalizar la aventura."
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {OCCASION_OPTIONS.map((option) => {
            const isSelected = selected === option.value
            const Icon = option.icon

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setWizardData({ occasion: option.value })}
                className={cn(
                  'flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all',
                  'hover:border-primary/50 hover:bg-primary/5',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-md shadow-primary/20'
                    : 'border-border bg-card'
                )}
                aria-pressed={isSelected}
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    'text-sm font-medium text-center transition-colors',
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
