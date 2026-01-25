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

export default function Step3Page() {
  return (
    <WizardShell
      currentStep={3}
      totalSteps={5}
      prevHref="/wizard/step-2"
      nextHref="/wizard/step-4"
    >
      <WizardStepCard
        title="¿Qué tema os gustaría?"
        description="Elige un tema para la narrativa de la aventura."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Tema de la aventura</Label>
            <Select>
              <SelectTrigger id="theme" className="h-12">
                <SelectValue placeholder="Selecciona un tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pirates">Piratas y tesoros</SelectItem>
                <SelectItem value="space">Exploradores del espacio</SelectItem>
                <SelectItem value="magic">Mundo mágico</SelectItem>
                <SelectItem value="dinosaurs">Era de los dinosaurios</SelectItem>
                <SelectItem value="detectives">Detectives y misterios</SelectItem>
                <SelectItem value="jungle">Aventura en la jungla</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
