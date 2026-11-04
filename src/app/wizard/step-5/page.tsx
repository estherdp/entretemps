'use client'

import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Search, Compass, Sparkles, Zap, Smile, LucideIcon } from 'lucide-react'
import { OptionTile } from '@/ui/components/option-tile'

import type { AdventureType } from '@/domain/wizard-data'
import { useWizard } from '@/ui/wizard/wizard-provider'

const OPTIONS: { value: AdventureType; label: string; icon: LucideIcon }[] = [
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {OPTIONS.map((option, index) => (
            <OptionTile
              key={option.value}
              index={index}
              label={option.label}
              icon={option.icon}
              selected={selected === option.value}
              onSelect={() => setWizardData({ adventureType: option.value })}
            />
          ))}
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
