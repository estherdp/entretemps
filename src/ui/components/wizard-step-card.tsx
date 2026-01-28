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
    <div className="space-y-6">
      {/* Step header */}
      <div className="space-y-3">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
          <span>✨</span>
          {badge}
        </span>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight text-foreground">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Card content */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50">
        {children}
      </div>
    </div>
  )
}
