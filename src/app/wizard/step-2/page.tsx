import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Label } from '@/ui/components/label'
import { Input } from '@/ui/components/input'

export default function Step2Page() {
  return (
    <WizardShell
      currentStep={2}
      totalSteps={5}
      prevHref="/wizard/step-1"
      nextHref="/wizard/step-3"
    >
      <WizardStepCard
        title="¿Qué edades tienen los niños?"
        description="Indica las edades para adaptar la dificultad de los retos."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="age-min">Edad mínima</Label>
            <Input
              id="age-min"
              type="number"
              placeholder="Ej: 5"
              min={3}
              max={16}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age-max">Edad máxima</Label>
            <Input
              id="age-max"
              type="number"
              placeholder="Ej: 10"
              min={3}
              max={16}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="num-children">Número de niños</Label>
            <Input
              id="num-children"
              type="number"
              placeholder="Ej: 4"
              min={1}
              max={20}
              className="h-12"
            />
          </div>
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
