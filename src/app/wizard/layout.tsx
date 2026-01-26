import { WizardProvider } from '@/ui/wizard/wizard-provider'

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WizardProvider>
      {children}
    </WizardProvider>
  )
}
