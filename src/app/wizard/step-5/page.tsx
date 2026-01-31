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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ADVENTURE_TYPE_OPTIONS.map((option) => {
            const isSelected = selected === option.value
            const Icon = option.icon

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setWizardData({ adventureType: option.value })}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  'hover:border-primary/50 hover:bg-primary/5',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-md shadow-primary/20'
                    : 'border-border bg-background'
                )}
                aria-pressed={isSelected}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center transition-colors',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
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
