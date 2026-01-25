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

export default function Step4Page() {
  return (
    <WizardShell
      currentStep={4}
      totalSteps={5}
      prevHref="/wizard/step-3"
      nextHref="/wizard/step-5"
    >
      <WizardStepCard
        title="¿Dónde será la aventura?"
        description="El lugar determina qué tipo de retos y escondites podemos sugerir."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Lugar</Label>
            <Select>
              <SelectTrigger id="location" className="h-12">
                <SelectValue placeholder="Selecciona el lugar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home-indoor">Casa (interior)</SelectItem>
                <SelectItem value="home-outdoor">Casa (jardín/terraza)</SelectItem>
                <SelectItem value="park">Parque</SelectItem>
                <SelectItem value="school">Colegio</SelectItem>
                <SelectItem value="other">Otro lugar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
