import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Label } from '@/ui/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select'

export default function Step1Page() {
  return (
    <WizardShell
      currentStep={1}
      totalSteps={5}
      nextHref="/wizard/step-2"
    >
      <WizardStepCard
        title="¿Qué ocasión celebráis?"
        description="Selecciona el tipo de evento para personalizar la aventura."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="occasion">Tipo de ocasión</Label>
            <Select>
              <SelectTrigger id="occasion" className="h-12">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">Cumpleaños</SelectItem>
                <SelectItem value="family-afternoon">Tarde en familia</SelectItem>
                <SelectItem value="party">Fiesta con amigos</SelectItem>
                <SelectItem value="outdoor">Actividad al aire libre</SelectItem>
                <SelectItem value="other">Otra ocasión</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
