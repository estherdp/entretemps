import Link from 'next/link'
import { Progress } from '@/ui/components/progress'
import { Button } from '@/ui/components/button'
import { Compass, Sparkles, Map, Package } from 'lucide-react'

interface WizardShellProps {
  currentStep: number
  totalSteps: number
  children: React.ReactNode
  prevHref?: string
  nextHref?: string
  nextLabel?: string
  nextDisabled?: boolean
}

const benefits = [
  { icon: Compass, text: 'Aventura personalizada para tu familia' },
  { icon: Sparkles, text: 'Retos adaptados a la edad de los niños' },
  { icon: Map, text: 'Guía paso a paso para montar la experiencia' },
  { icon: Package, text: 'Pack descargable listo para imprimir' },
]

export function WizardShell({
  currentStep,
  totalSteps,
  children,
  prevHref,
  nextHref,
  nextLabel = 'Siguiente',
  nextDisabled = false,
}: WizardShellProps) {
  const progressValue = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile: single column / Desktop: 2 columns */}
      <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">

        {/* Left column - Context (hidden on mobile, visible on lg+) */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-12 xl:px-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-32 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

          <div className="relative z-10 max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="text-primary">Entre</span>
                <span className="text-foreground">temps</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Crea experiencias que recordaréis siempre
              </p>
            </div>

            {/* Copy */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Diseña tu aventura familiar
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                En solo unos pasos, crearemos un escape room personalizado
                para vuestra próxima celebración. Sin complicaciones,
                sin estrés, solo diversión.
              </p>
            </div>

            {/* Benefits list */}
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column - Form */}
        <div className="flex flex-col min-h-screen lg:min-h-0">
          {/* Header with progress - visible on all screens */}
          <div className="p-4 lg:p-8 lg:pb-0">
            {/* Mobile logo */}
            <div className="lg:hidden mb-6">
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-primary">Entre</span>
                <span className="text-foreground">temps</span>
              </h1>
            </div>

            {/* Progress */}
            <div className="max-w-md mx-auto lg:max-w-none">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Paso {currentStep} de {totalSteps}
                </span>
                <span className="text-primary font-medium">
                  {Math.round(progressValue)}%
                </span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          </div>

          {/* Form content */}
          <div className="flex-1 flex flex-col p-4 lg:p-8 lg:pt-6">
            <div className="flex-1 max-w-md mx-auto w-full lg:max-w-none">
              {children}
            </div>

            {/* Navigation buttons */}
            <div className="max-w-md mx-auto w-full lg:max-w-none pt-6">
              <div className="flex gap-3">
                {prevHref ? (
                  <Button variant="outline" asChild className="flex-1 lg:flex-none lg:px-8">
                    <Link href={prevHref}>Atrás</Link>
                  </Button>
                ) : (
                  <div className="flex-1 lg:hidden" />
                )}
                <div className="flex-1 lg:flex-1 lg:flex lg:justify-end">
                  {nextHref ? (
                    <Button
                      asChild
                      className="w-full lg:w-auto lg:px-8"
                      disabled={nextDisabled}
                    >
                      <Link href={nextDisabled ? '#' : nextHref}>{nextLabel}</Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full lg:w-auto lg:px-8"
                      disabled={nextDisabled}
                    >
                      {nextLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
