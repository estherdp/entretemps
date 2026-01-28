'use client'

import { useState } from 'react'
import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Home, Flower2, Trees, Building, Compass, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { validateStep4 } from '@/application/validate-wizard-step'

import type { Place } from '@/domain/wizard-data'
import { useWizard } from '@/ui/wizard/wizard-provider'

const LOCATION_OPTIONS :{ value: Place; label: string; subtitle: string; icon: LucideIcon }[] = [
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
      totalSteps={6}
      prevHref="/wizard/step-3"
      nextHref="/wizard/step-5"
      nextDisabled={!validation.isValid}
      validationMessage={!validation.isValid ? validation.message : undefined}
    >
      <WizardStepCard
        title="¿Dónde será la aventura?"
        description="El lugar determina qué tipo de retos y escondites podemos sugerir."
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {LOCATION_OPTIONS.map((option) => {
            const isSelected = selected === option.value
            const Icon = option.icon

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setWizardData({ place: option.value })}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
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
                    'w-11 h-11 rounded-full flex items-center justify-center transition-colors',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <span
                    className={cn(
                      'block text-sm font-medium transition-colors',
                      isSelected ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {option.label}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {option.subtitle}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
