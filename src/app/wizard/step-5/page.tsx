'use client'

import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card'
import { Search, Compass, Sparkles, Zap, Smile, LucideIcon, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { validateStep5 } from '@/application/validate-wizard-step'

import type {AdventureType, Tone, Difficulty} from '@/domain/wizard-data'
import { useWizard } from '@/ui/wizard/wizard-provider'
import {
  ADVENTURE_TYPE_LABELS,
  TONE_LABELS,
  DIFFICULTY_LABELS
} from '@/ui/wizard/labels'


const ADVENTURE_TYPE_OPTIONS : { value: AdventureType; label: string; icon: LucideIcon }[] = [
  { value: 'mystery', label: 'Misterio', icon: Search },
  { value: 'adventure', label: 'Aventura', icon: Compass },
  { value: 'fantasy', label: 'Fantasía', icon: Sparkles },
  { value: 'action', label: 'Acción', icon: Zap },
  { value: 'humor', label: 'Humor', icon: Smile },
]

const TONE_OPTIONS : { value: Tone; label: string }[]= [
  { value: 'funny', label: 'Divertida' },
  { value: 'enigmatic', label: 'Enigmática' },
  { value: 'exciting', label: 'Emocionante' },
  { value: 'calm', label: 'Tranquila' },
]

const DIFFICULTY_OPTIONS : { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Media' },
  { value: 'hard', label: 'Desafiante' },
]

export default function Step5Page() {
  const {wizardData, setWizardData} = useWizard()
  const adventure = wizardData.adventureType || null
  const tone = wizardData.tone || null
  const difficulty = wizardData.difficulty || null
  const validation = validateStep5(wizardData)

  // Check if all selections are made
  const allSelected = adventure && tone && difficulty

  return (
    <WizardShell
      currentStep={5}
      totalSteps={6}
      prevHref="/wizard/step-4"
      nextHref="/wizard/step-6"
      nextDisabled={!validation.isValid}
      validationMessage={!validation.isValid ? validation.message : undefined}
    >
      <WizardStepCard
        title="Demos forma a la historia"
        description="Personaliza el estilo y nivel de desafío de tu aventura."
      >
        <div className="space-y-6">
          {/* Summary card - shown when all options selected */}
          {allSelected && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Tu aventura será:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ADVENTURE_TYPE_LABELS[adventure]} • {TONE_LABELS[tone]} • {DIFFICULTY_LABELS[difficulty]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tipo de aventura */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Tipo de aventura</CardTitle>
              <CardDescription>
                Elige el género que más te guste para tu historia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {ADVENTURE_TYPE_OPTIONS.map((option) => {
                  const isSelected = adventure === option.value
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
            </CardContent>
          </Card>

          {/* Tono de la historia */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Tono de la historia</CardTitle>
              <CardDescription>
                Define el ambiente y sensación de tu aventura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((option) => {
                  const isSelected = tone === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setWizardData({ tone: option.value })}
                      className={cn(
                        'px-4 py-2.5 rounded-full text-sm font-medium transition-all',
                        'border-2',
                        'hover:border-primary/50 hover:bg-primary/5',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border bg-background text-foreground'
                      )}
                      aria-pressed={isSelected}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Dificultad */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Nivel de dificultad</CardTitle>
              <CardDescription>
                Los retos se adaptarán al nivel que elijas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTY_OPTIONS.map((option) => {
                  const isSelected = difficulty === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setWizardData({ difficulty: option.value })}
                      className={cn(
                        'px-4 py-3 rounded-lg text-sm font-medium transition-all',
                        'border-2',
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
            </CardContent>
          </Card>
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
