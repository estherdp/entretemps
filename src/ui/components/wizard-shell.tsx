import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/ui/components/button'
import { cn } from '@/lib/utils'

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

/** Progreso como una ruta del mapa: cada paso es una parada. */
function RouteProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progressValue = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="font-hand text-2xl text-tomato">Paso {currentStep} de {totalSteps}</span>
        <span className="text-sm font-bold text-ink-soft">{progressValue}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressValue}
        aria-label="Progreso del asistente"
        className="relative flex items-center justify-between"
      >
        <div className="route absolute inset-x-2 top-1/2 -translate-y-1/2" aria-hidden="true" />
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1
          const isDone = step < currentStep
          const isCurrent = step === currentStep
          return (
            <span
              key={step}
              aria-hidden="true"
              className={cn(
                'relative grid place-items-center rounded-full border-2 border-ink text-xs font-bold transition-all',
                isCurrent ? 'h-9 w-9 bg-tomato text-paper shadow-sticker-sm' : 'h-6 w-6',
                isDone && 'bg-forest text-paper',
                !isDone && !isCurrent && 'bg-card text-ink-soft'
              )}
            >
              {isDone ? '✓' : step}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function ValidationNote({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="rounded-xl border-2 border-dashed border-sun bg-sun/15 px-4 py-3 text-sm font-bold text-ink">
      {message}
    </p>
  )
}

function NavButtons({
  prevHref,
  nextHref,
  nextLabel,
  nextDisabled,
  onNext,
  stretch,
}: Pick<WizardShellProps, 'prevHref' | 'nextHref' | 'nextLabel' | 'nextDisabled' | 'onNext'> & { stretch?: boolean }) {
  const size = stretch ? 'lg' : 'default'
  return (
    <div className="flex gap-3">
      {prevHref ? (
        <Button variant="outline" size={size} asChild className={cn(stretch && 'flex-1')}>
          <Link href={prevHref}>
            <ArrowLeft /> Atrás
          </Link>
        </Button>
      ) : null}
      <div className={cn('flex justify-end', stretch ? 'flex-1' : 'flex-1')}>
        {nextHref ? (
          <Button asChild size={size} disabled={nextDisabled} className={cn(stretch && 'w-full', nextDisabled && 'pointer-events-none opacity-50')}>
            <Link href={nextDisabled ? '#' : nextHref} aria-disabled={nextDisabled}>
              {nextLabel} <ArrowRight />
            </Link>
          </Button>
        ) : (
          <Button size={size} disabled={nextDisabled} onClick={onNext} className={cn(stretch && 'w-full')}>
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  )
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
  const navProps = { prevHref, nextHref, nextLabel, nextDisabled, onNext }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-10 md:pt-14">
        <div className="space-y-10">
          <RouteProgress currentStep={currentStep} totalSteps={totalSteps} />

          <div className="space-y-6 pb-40 lg:pb-4">{children}</div>

          <div className="hidden space-y-4 lg:block">
            <ValidationNote message={validationMessage} />
            <NavButtons {...navProps} />
          </div>
        </div>
      </div>

      {/* Pie fijo en móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper/95 backdrop-blur-md lg:hidden">
        <div className="space-y-3 px-4 pb-6 pt-4">
          <ValidationNote message={validationMessage} />
          <NavButtons {...navProps} stretch />
        </div>
      </div>
    </div>
  )
}
