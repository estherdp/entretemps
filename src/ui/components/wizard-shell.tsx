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
  validationMessage?: string
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
  validationMessage,
}: WizardShellProps) {
  const progressValue = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Single column layout */}
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-8">
        <div className="space-y-10">
          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Paso {currentStep} de {totalSteps}
              </span>
              <span className="text-primary font-semibold">
                {Math.round(progressValue)}%
              </span>
            </div>
            <Progress value={progressValue} className="h-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-primary" />
          </div>

          {/* Form content */}
          <div className="space-y-6 pb-32 lg:pb-8">
            {children}
          </div>

          {/* Desktop navigation buttons (hidden on mobile) */}
          <div className="hidden lg:block space-y-4">
            {validationMessage && (
              <div className="text-sm text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-5 py-3.5 rounded-xl border border-amber-200 dark:border-amber-800">
                {validationMessage}
              </div>
            )}
            <div className="flex gap-4">
              {prevHref ? (
                <Button variant="outline" asChild className="h-12 px-6 rounded-xl border-slate-300 dark:border-slate-700">
                  <Link href={prevHref}>Atrás</Link>
                </Button>
              ) : null}
              <div className="flex-1 flex justify-end">
                {nextHref ? (
                  <Button
                    asChild
                    disabled={nextDisabled}
                    className="h-12 px-8 rounded-xl font-semibold"
                  >
                    <Link href={nextDisabled ? '#' : nextHref}>{nextLabel}</Link>
                  </Button>
                ) : (
                  <Button
                    disabled={nextDisabled}
                    onClick={onNext}
                    className="h-12 px-8 rounded-xl font-semibold"
                  >
                    {nextLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky footer (hidden on desktop) */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)]">
        <div className="px-6 py-4 pb-8 space-y-4">
          {validationMessage && (
            <div className="text-sm text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-5 py-3.5 rounded-xl border border-amber-200 dark:border-amber-800">
              {validationMessage}
            </div>
          )}
          <div className="flex gap-3">
            {prevHref ? (
              <Button variant="outline" asChild className="flex-1 h-14 rounded-xl border-slate-300 dark:border-slate-700 font-semibold">
                <Link href={prevHref}>Atrás</Link>
              </Button>
            ) : null}
            <div className={prevHref ? 'flex-1' : 'w-full'}>
              {nextHref ? (
                <Button
                  asChild
                  className="w-full h-14 rounded-xl font-semibold"
                  disabled={nextDisabled}
                >
                  <Link href={nextDisabled ? '#' : nextHref}>{nextLabel}</Link>
                </Button>
              ) : (
                <Button
                  className="w-full h-14 rounded-xl font-semibold"
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
