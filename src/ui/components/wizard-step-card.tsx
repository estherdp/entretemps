interface WizardStepCardProps {
  title: string
  description?: string
  badge?: string
  children: React.ReactNode
}

export function WizardStepCard({
  title,
  description,
  badge = "Modo creativo",
  children
}: WizardStepCardProps) {
  return (
    <div className="space-y-8">
      {/* Step header */}
      <div className="space-y-4">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-semibold tracking-wide uppercase border border-primary/10">
          <span>✨</span>
          {badge}
        </span>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Card content */}
      <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
        {children}
      </div>
    </div>
  )
}
