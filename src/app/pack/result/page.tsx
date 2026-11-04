'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Plus, Printer, Save } from 'lucide-react'
import { Button } from '@/ui/components/button'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import {
  AdventureHero,
  AdventurePage,
  AdventureSection,
  CenteredMessage,
  ConclusionSection,
  IntroductionSection,
  MaterialsChecklist,
  MissionSheet,
  sortMissions,
} from '@/ui/components/adventure-sections'
import { adventurePackToText } from '@/ui/adventure-plain-text'
import { useSaveAdventurePack } from '@/ui/hooks/use-save-adventure-pack'

export default function PackResultPage() {
  const router = useRouter()
  const [pack, setPack] = useState<GeneratedAdventurePack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const { save, isSaving, saved, error: saveError } = useSaveAdventurePack()

  useEffect(() => {
    const stored = sessionStorage.getItem('generated-adventure-pack')
    if (stored) {
      setPack(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const handleSave = async () => {
    if (!pack) return

    const success = await save(pack)
    if (!success && saveError?.includes('iniciar sesión')) {
      router.push('/login')
    }
  }

  const handleCopy = async () => {
    if (!pack) return
    try {
      await navigator.clipboard.writeText(adventurePackToText(pack))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error al copiar:', error)
    }
  }

  if (isLoading) {
    return (
      <CenteredMessage>
        <p className="font-hand text-2xl text-ink-soft">Cargando aventura…</p>
      </CenteredMessage>
    )
  }

  if (!pack) {
    return (
      <CenteredMessage>
        <p className="font-display text-2xl">No se encontró ninguna aventura generada.</p>
        <Button onClick={() => router.push('/wizard/step-1')}>Crear nueva aventura</Button>
      </CenteredMessage>
    )
  }

  return (
    <AdventurePage>
      <AdventureHero
        pack={pack}
        kicker="¡Tu aventura está lista!"
        title={<h1 className="text-4xl leading-[1.05] md:text-6xl">{pack.title}</h1>}
        actions={
          <>
            <Button onClick={handleSave} disabled={isSaving || saved} variant={saved ? 'secondary' : 'default'}>
              {saved ? <Check /> : <Save />}
              {saved ? 'Guardado' : isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button onClick={() => window.print()} variant="outline">
              <Printer /> Imprimir
            </Button>
            <Button onClick={handleCopy} variant="outline">
              {copied ? <Check /> : <Copy />}
              {copied ? '¡Copiado!' : 'Copiar texto'}
            </Button>
          </>
        }
      />

      {saveError && (
        <p role="alert" className="no-print rounded-xl border-2 border-tomato bg-tomato/10 p-3 text-center font-bold text-tomato">
          {saveError}
        </p>
      )}

      <IntroductionSection story={pack.introduction.story} note={pack.introduction.setupForParents} />

      <MaterialsChecklist materials={pack.materials} />

      <AdventureSection kicker={`${pack.missions.length} paradas en el mapa`} title="Misiones">
        <div className="space-y-8">
          {sortMissions(pack.missions).map((mission) => (
            <MissionSheet key={mission.order} mission={mission} />
          ))}
        </div>
      </AdventureSection>

      <ConclusionSection story={pack.conclusion.story} note={pack.conclusion.celebrationTip} />

      <div className="no-print flex flex-col items-center gap-4 rounded-3xl border-2 border-ink bg-ink px-6 py-10 text-center text-paper">
        <p className="font-display text-3xl">¿Otra aventura?</p>
        <Button variant="secondary" onClick={() => router.push('/wizard/step-1')}>
          <Plus /> Nueva aventura
        </Button>
        <p className="text-sm text-paper/70">
          Pack creado el{' '}
          {new Date(pack.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </AdventurePage>
  )
}
