'use client'

import { useState } from 'react'
import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Label } from '@/ui/components/label'
import { Textarea } from '@/ui/components/textarea'
import { Button } from '@/ui/components/button'

const SUGGESTED_CHIPS = [
  'Superhéroes',
  'Piratas',
  'Dinosaurios',
  'Princesas',
  'Misterio',
]

export default function Step3Page() {
  const [interests, setInterests] = useState('')

  const handleChipClick = (chip: string) => {
    setInterests((prev) => {
      const newInterests = prev.split(', ').map((term) => term.toLowerCase())
      if (!newInterests.includes(chip.toLowerCase())) {
        return prev ? `${prev}, ${chip}` : chip
      }
      return prev
    })
  }

  return (
    <WizardShell
      currentStep={3}
      totalSteps={5}
      prevHref="/wizard/step-2"
      nextHref="/wizard/step-4"
    >
      <WizardStepCard
        title="¿Qué le encanta al/la protagonista?"
        description="Escribe personajes, hobbies o universos que le hagan ilusión. Cuanto más concreto, mejor."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interests">Intereses del protagonista</Label>
            <Textarea
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Ej: Superman, dinosaurios, Harry Potter, fútbol, la Oveja Dolly…"
              className="min-h-28 resize-none"
            />
          </div>

          {/* Suggested chips */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Ideas para inspirarte:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_CHIPS.map((chip) => (
                <Button
                  key={chip}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full"
                >
                  {chip}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
