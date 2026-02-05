'use client'

import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Search, Compass, Sparkles, Zap, Smile, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { AdventureType } from '@/domain/wizard-data'
import { useWizard } from '@/ui/wizard/wizard-provider'

const ADVENTURE_TYPE_OPTIONS: { value: AdventureType; label: string; icon: LucideIcon }[] = [
  { value: 'mystery', label: 'Misterio', icon: Search },
  { value: 'adventure', label: 'Aventura', icon: Compass },
  { value: 'fantasy', label: 'Fantasía', icon: Sparkles },
  { value: 'action', label: 'Acción', icon: Zap },
  { value: 'humor', label: 'Humor', icon: Smile },
]

export default function Step5Page() {
  const { wizardData, setWizardData } = useWizard()
  const selected = wizardData.adventureType || null

  return (
    <WizardShell
      currentStep={5}
      totalSteps={8}
      prevHref="/wizard/step-4"
      nextHref="/wizard/step-6"
      nextDisabled={!selected}
      validationMessage={!selected ? 'Selecciona un tipo de aventura' : undefined}
    >
      <WizardStepCard
        title="Tipo de aventura"
        description="Elige el género que más te guste para tu historia."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {ADVENTURE_TYPE_OPTIONS.map((option) => {
            const isSelected = selected === option.value
            const Icon = option.icon

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setWizardData({ adventureType: option.value })}
                className={cn(
                  'group flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-200',
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
                    'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200',
                    'group-hover:scale-110',
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  )}
                >
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
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
