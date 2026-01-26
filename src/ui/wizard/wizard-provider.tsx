'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'
import type { WizardData } from '@/domain/wizard-data'

type WizardContextValue = {
  wizardData: WizardData
  setWizardData: (patch: Partial<WizardData>) => void
  resetWizardData: () => void
}

const WizardContext = createContext<WizardContextValue | undefined>(undefined)

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [wizardData, setWizardDataState] = useState<WizardData>({})

  const setWizardData = (patch: Partial<WizardData>) => {
    setWizardDataState((prev) => ({ ...prev, ...patch }))
  }

  const resetWizardData = () => setWizardDataState({})

  const value = useMemo(
    () => ({ wizardData, setWizardData, resetWizardData }),
    [wizardData]
  )

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard must be used within WizardProvider')
  return ctx
}
