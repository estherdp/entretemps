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
  { icon: Sparkles, text: 'Aventura personalizada para tu familia' },
  { icon: Compass, text: 'Retos adaptados a la edad de los niños' },
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
    <div className="min-h-screen bg-slate-50/80 lg:bg-slate-100/50">
      {/* Mobile: single column / Desktop: 2 columns */}
      <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">

        {/* Left column - Context (hidden on mobile, visible on lg+) */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:px-10 xl:px-16 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -right-16 w-72 h-72 bg-accent/15 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-md py-12">
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
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/60 shadow-sm flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column - Form */}
        <div className="flex flex-col min-h-screen lg:min-h-0 lg:bg-white lg:py-12">
          {/* Header with progress */}
          <div className="px-6 pt-6 lg:px-10 xl:px-12 lg:pt-0 lg:pb-0">
            {/* Mobile logo */}
            <div className="lg:hidden mb-5">
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
                <span className="text-accent font-semibold">
                  {Math.round(progressValue)}%
                </span>
              </div>
              <Progress value={progressValue} className="h-2 bg-muted [&>div]:bg-accent" />
            </div>
          </div>

          {/* Form content - extra bottom padding on mobile for sticky footer */}
          <div className="flex-1 flex flex-col px-6 pt-6 pb-32 lg:px-10 xl:px-12 lg:pt-8 lg:pb-4">
            <div className="flex-1 max-w-md mx-auto w-full lg:max-w-none space-y-6">
              {children}
            </div>

            {/* Desktop navigation buttons (hidden on mobile) */}
            <div className="hidden lg:block max-w-md mx-auto w-full lg:max-w-none pt-8">
              <div className="flex gap-3">
                {prevHref ? (
                  <Button variant="outline" asChild className="px-8 rounded-xl">
                    <Link href={prevHref}>Atrás</Link>
                  </Button>
                ) : null}
                <div className="flex-1 flex justify-end">
                  {nextHref ? (
                    <Button
                      asChild
                      className="px-8 rounded-xl shadow-md shadow-primary/25"
                      disabled={nextDisabled}
                    >
                      <Link href={nextDisabled ? '#' : nextHref}>{nextLabel}</Link>
                    </Button>
                  ) : (
                    <Button
                      className="px-8 rounded-xl shadow-md shadow-primary/25"
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

      {/* Mobile sticky footer (hidden on desktop) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/90 backdrop-blur-xl border-t border-border/40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="px-6 py-4 pb-8 max-w-md mx-auto">
          <div className="flex gap-3">
            {prevHref ? (
              <Button variant="outline" asChild className="flex-1 h-12 rounded-xl">
                <Link href={prevHref}>Atrás</Link>
              </Button>
            ) : null}
            <div className={prevHref ? 'flex-1' : 'w-full'}>
              {nextHref ? (
                <Button
                  asChild
                  className="w-full h-12 rounded-xl shadow-lg shadow-primary/30"
                  disabled={nextDisabled}
                >
                  <Link href={nextDisabled ? '#' : nextHref}>{nextLabel}</Link>
                </Button>
              ) : (
                <Button
                  className="w-full h-12 rounded-xl shadow-lg shadow-primary/30"
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
  )
}
