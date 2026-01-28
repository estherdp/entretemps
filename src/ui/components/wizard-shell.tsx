import Link from 'next/link'
import { Progress } from '@/ui/components/progress'
import { Button } from '@/ui/components/button'

interface WizardShellProps {
  currentStep: number
  totalSteps: number
  children: React.ReactNode
  prevHref?: string
  nextHref?: string
  nextLabel?: string
  nextDisabled?: boolean
  onNext?: () => void
}

export function WizardShell({
  currentStep,
  totalSteps,
  children,
  prevHref,
  nextHref,
  nextLabel = 'Siguiente',
  nextDisabled = false,
  onNext,
}: WizardShellProps) {
  const progressValue = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Single column layout */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">
        <div className="space-y-8">
          {/* Progress */}
          <div>
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

          {/* Form content */}
          <div className="space-y-6 pb-32 lg:pb-8">
            {children}
          </div>

          {/* Desktop navigation buttons (hidden on mobile) */}
          <div className="hidden lg:flex gap-3">
            {prevHref ? (
              <Button variant="outline" asChild>
                <Link href={prevHref}>Atrás</Link>
              </Button>
            ) : null}
            <div className="flex-1 flex justify-end">
              {nextHref ? (
                <Button
                  asChild
                  disabled={nextDisabled}
                >
                  <Link href={nextDisabled ? '#' : nextHref}>{nextLabel}</Link>
                </Button>
              ) : (
                <Button
                  disabled={nextDisabled}
                  onClick={onNext}
                >
                  {nextLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky footer (hidden on desktop) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background/90 backdrop-blur-xl border-t border-border/40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="px-6 py-4 pb-8">
          <div className="flex gap-3">
            {prevHref ? (
              <Button variant="outline" asChild className="flex-1 h-12">
                <Link href={prevHref}>Atrás</Link>
              </Button>
            ) : null}
            <div className={prevHref ? 'flex-1' : 'w-full'}>
              {nextHref ? (
                <Button
                  asChild
                  className="w-full h-12"
                  disabled={nextDisabled}
                >
                  <Link href={nextDisabled ? '#' : nextHref}>{nextLabel}</Link>
                </Button>
              ) : (
                <Button
                  className="w-full h-12"
                  disabled={nextDisabled}
                  onClick={onNext}
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
