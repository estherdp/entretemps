'use client'

import { useState } from 'react'
import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Label } from '@/ui/components/label'
import { Textarea } from '@/ui/components/textarea'
import { Button } from '@/ui/components/button'
import { validateStep3 } from '@/application/validate-wizard-step'

import { useWizard } from '@/ui/wizard/wizard-provider'

const SUGGESTED_CHIPS = [
  'Superhéroes',
  'Piratas',
  'Dinosaurios',
  'Princesas',
  'Misterio',
]

function normalizeTerms(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.toLowerCase())
}

export default function Step3Page() {
  const {wizardData, setWizardData} = useWizard()
  const interests = wizardData.interests ?? ''
  const validation = validateStep3(wizardData)

  const handleChipClick = (chip: string) => {
    const current = interests
    const terms = normalizeTerms(current)

    if (!terms.includes(chip.toLowerCase())) {
      const next = current.trim() ? `${current.trim()}, ${chip}` : chip
      setWizardData({ interests: next })
    }
  }

  return (
    <WizardShell
      currentStep={3}
      totalSteps={8}
      prevHref="/wizard/step-2"
      nextHref="/wizard/step-4"
      nextDisabled={!validation.isValid}
      validationMessage={!validation.isValid ? validation.message : undefined}
    >
      <WizardStepCard
        title="¿Qué le encanta al/la protagonista?"
        description="Escribe personajes, hobbies o universos que le hagan ilusión. Cuanto más concreto, mejor."
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="interests" className="text-base font-semibold">
              Intereses del protagonista
            </Label>
            <Textarea
              id="interests"
              value={interests}
              onChange={(e) => setWizardData({ interests: e.target.value })}
              placeholder="Ej: Superman, dinosaurios, Harry Potter, fútbol, la Oveja Dolly…"
              className="min-h-32 resize-none rounded-2xl border-border/60 shadow-premium focus:shadow-premium-lg focus:border-primary/60 transition-all"
            />
            <p className="text-xs text-muted-foreground">
              Separa varios intereses con comas. Cuanto más específico, ¡mejor!
            </p>
          </div>

          {/* Suggested chips - Modern bubbles */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
              Ideas para inspirarte
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary border border-primary/20 hover:border-primary/40 hover:shadow-premium hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
