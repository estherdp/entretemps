interface WizardStepCardProps {
  title: string
  description?: string
  badge?: string
  children: React.ReactNode
}

export function WizardStepCard({
  title,
  description,
  badge = 'Modo creativo',
  children,
}: WizardStepCardProps) {
  return (
    <div className="stagger space-y-8">
      <div className="space-y-3">
        <span className="inline-block -rotate-2 rounded-full border-2 border-ink bg-sun px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
          {badge}
        </span>
        <h2 className="text-3xl leading-tight md:text-5xl">{title}</h2>
        {description && <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">{description}</p>}
      </div>

      <div className="sticker p-5 sm:p-8">{children}</div>
    </div>
  )
}
