import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/components/card'

interface WizardStepCardProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function WizardStepCard({ title, description, children }: WizardStepCardProps) {
  return (
    <Card className="border-0 shadow-sm lg:shadow-none lg:bg-transparent">
      <CardHeader className="px-0 lg:px-0 pt-0">
        <CardTitle className="text-xl lg:text-2xl font-semibold">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-0 lg:px-0">
        {children}
      </CardContent>
    </Card>
  )
}
