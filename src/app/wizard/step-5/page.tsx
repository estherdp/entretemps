'use client'

import { useState } from 'react'
import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Search, Compass, Sparkles, Zap, Smile } from 'lucide-react'
import { cn } from '@/lib/utils'

const ADVENTURE_TYPE_OPTIONS = [
  { value: 'misterio', label: 'Misterio', icon: Search },
  { value: 'aventura', label: 'Aventura', icon: Compass },
  { value: 'fantasia', label: 'Fantasía', icon: Sparkles },
  { value: 'accion', label: 'Acción', icon: Zap },
  { value: 'humor', label: 'Humor', icon: Smile },
]

const TONE_OPTIONS = [
  { value: 'divertida', label: 'Divertida' },
  { value: 'enigmatica', label: 'Enigmática' },
  { value: 'emocionante', label: 'Emocionante' },
  { value: 'tranquila', label: 'Tranquila' },
]

const DIFFICULTY_OPTIONS = [
  { value: 'facil', label: 'Fácil' },
  { value: 'media', label: 'Media' },
  { value: 'desafiante', label: 'Desafiante' },
]

export default function Step5Page() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedTone, setSelectedTone] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  return (
    <WizardShell
      currentStep={5}
      totalSteps={6}
      prevHref="/wizard/step-4"
      nextHref="/wizard/step-6"
    >
      <WizardStepCard
        title="Demos forma a la historia"
        description="Estas elecciones nos ayudarán a crear una aventura a medida."
      >
        <div className="space-y-8">
          {/* Tipus d'aventura */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Tipo de aventura</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {ADVENTURE_TYPE_OPTIONS.map((option) => {
                const isSelected = selectedType === option.value
                const Icon = option.icon

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedType(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      'hover:border-primary/50 hover:bg-primary/5',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-md shadow-primary/20'
                        : 'border-border bg-white'
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
          </section>

          {/* To de la història */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Tono de la historia</h3>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((option) => {
                const isSelected = selectedTone === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedTone(option.value)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all',
                      'border-2',
                      'hover:border-primary/50 hover:bg-primary/5',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-border bg-white text-foreground'
                    )}
                    aria-pressed={isSelected}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Dificultad */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Dificultad</h3>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((option) => {
                const isSelected = selectedDifficulty === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedDifficulty(option.value)}
                    className={cn(
                      'px-5 py-2.5 rounded-lg text-sm font-medium transition-all',
                      'border-2',
                      'hover:border-primary/50 hover:bg-primary/5',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : 'border-border bg-muted/50 text-foreground'
                    )}
                    aria-pressed={isSelected}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Adaptaremos los retos a esta dificultad.
            </p>
          </section>
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
