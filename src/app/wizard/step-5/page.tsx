import { WizardShell } from '@/ui/components/wizard-shell'
import { WizardStepCard } from '@/ui/components/wizard-step-card'
import { Card, CardContent } from '@/ui/components/card'

export default function Step5Page() {
  return (
    <WizardShell
      currentStep={5}
      totalSteps={5}
      prevHref="/wizard/step-4"
      nextLabel="Generar aventura"
      nextDisabled={true}
    >
      <WizardStepCard
        title="Resumen de tu aventura"
        description="Revisa los datos antes de generar tu Pack de Aventura."
      >
        <div className="space-y-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ocasión:</span>
                <span className="font-medium">Cumpleaños</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Edades:</span>
                <span className="font-medium">5 - 10 años</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Niños:</span>
                <span className="font-medium">4 participantes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tema:</span>
                <span className="font-medium">Piratas y tesoros</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lugar:</span>
                <span className="font-medium">Casa (jardín)</span>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            El botón estará activo cuando se implemente la generación con IA.
          </p>
        </div>
      </WizardStepCard>
    </WizardShell>
  )
}
