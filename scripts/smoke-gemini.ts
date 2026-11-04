// scripts/smoke-gemini.ts
//
// Prueba real (1 petición) contra Gemini con el contrato de salida actual.
// Uso: pnpm smoke:gemini

import { GeminiAdapter } from '../src/infrastructure/ai/adapters/gemini.adapter'
import { buildAdventureConstraints } from '../src/application/adventure-constraints'
import type { WizardData } from '../src/domain/wizard-data'

const wizardData: WizardData = {
  occasion: 'birthday',
  ages: { min: 5, max: 8 },
  kidsCount: 6,
  interests: 'dinosaurios',
  place: 'garden',
  adventureType: 'mystery',
  tone: 'funny',
  difficulty: 'easy',
}

async function main() {
  const started = Date.now()
  const pack = await new GeminiAdapter().generateAdventure(wizardData, 'es', buildAdventureConstraints(wizardData))
  console.log(JSON.stringify(pack, null, 2))
  console.log(`\n✅ ${pack.missions.length} misiones en ${((Date.now() - started) / 1000).toFixed(1)}s`)
}

main().catch((error) => {
  console.error('❌', error)
  process.exit(1)
})
