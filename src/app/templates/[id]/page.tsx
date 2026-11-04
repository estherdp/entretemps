'use client'

import { useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { LogIn, Printer, Save } from 'lucide-react'
import { Button } from '@/ui/components/button'
import { getTemplateById } from '@/application/get-template-by-id'
import { useSaveTemplateAsMyPack } from '@/ui/hooks/use-save-template'
import { useRepositories } from '@/ui/providers/repository-provider'
import { useAuth } from '@/ui/hooks/use-auth'
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

export default function TemplateDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { templateRepository } = useRepositories()
  const { user } = useAuth()
  // Las plantillas son datos estáticos: se resuelven al renderizar
  const pack: GeneratedAdventurePack | null = useMemo(
    () => getTemplateById(params.id as string, templateRepository),
    [params.id, templateRepository]
  )
  
  const { saveTemplate, isSaving, error: saveError } = useSaveTemplateAsMyPack()

  // Scroll to top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [params.id])

  const handleSaveAsMyPack = async () => {
    if (!pack) return

    const savedPack = await saveTemplate(pack)
    if (savedPack) {
      router.push(`/my-adventures/${savedPack.id}`)
    }
  }

  const loginHref = `/login?next=${encodeURIComponent(`/templates/${params.id as string}`)}`

  if (!pack) {
    return (
      <CenteredMessage>
        <p className="font-display text-2xl">No se encontró la plantilla.</p>
        <Button onClick={() => router.push('/')}>Volver al inicio</Button>
      </CenteredMessage>
    )
  }

  return (
    <AdventurePage>
      <AdventureHero
        pack={pack}
        kicker={user ? 'Plantilla lista para jugar' : 'Prueba gratis · sin registro'}
        title={<h1 className="text-4xl leading-[1.05] md:text-6xl">{pack.title}</h1>}
        actions={
          <>
            {user ? (
              <Button onClick={handleSaveAsMyPack} disabled={isSaving}>
                <Save /> {isSaving ? 'Guardando...' : 'Guardar en mis aventuras'}
              </Button>
            ) : (
              <Button onClick={() => router.push(loginHref)}>
                <LogIn /> Entra para guardarla
              </Button>
            )}
            <Button onClick={() => window.print()} variant="outline">
              <Printer /> Imprimir pack
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
    </AdventurePage>
  )
}
