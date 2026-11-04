'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/ui/components/button'
import { AdventureCard } from '@/ui/components/adventure-card'
import { useMyAdventurePacks } from '@/ui/hooks/use-my-adventure-packs'

export default function MyAdventuresPage() {
  const router = useRouter()
  const { packs, isLoading, error, needsAuth } = useMyAdventurePacks()

  // Redirect if needs authentication
  useEffect(() => {
    if (needsAuth) {
      router.push('/login')
    }
  }, [needsAuth, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-hand text-2xl text-ink-soft">Abriendo tu cuaderno…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-4">
        <p className="font-bold text-destructive">{error}</p>
        <Button onClick={() => router.push('/')}>Volver al inicio</Button>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 pb-24 pt-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-hand text-2xl text-tomato">Tu colección</p>
          <h1 className="text-4xl md:text-5xl">Mis aventuras</h1>
          <p className="mt-2 text-ink-soft">
            {packs.length === 1 ? '1 aventura guardada' : `${packs.length} aventuras guardadas`}
          </p>
        </div>
        <Button onClick={() => router.push('/wizard/step-1')}>
          <Plus /> Nueva aventura
        </Button>
      </div>

      {packs.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-ink/40 px-6 py-16 text-center">
          <p className="font-display text-2xl">Todavía no has guardado ninguna aventura.</p>
          <p className="mt-2 text-ink-soft">Crea una nueva o empieza desde una plantilla.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => router.push('/wizard/step-1')}>Crear tu primera aventura</Button>
            <Button variant="outline" onClick={() => router.push('/#plantillas')}>
              Ver plantillas
            </Button>
          </div>
        </div>
      ) : (
        <div className="stagger grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {packs.map((pack) => (
            <AdventureCard
              key={pack.id}
              id={pack.id}
              title={pack.title}
              ageRange={pack.pack.ageRange}
              estimatedDurationMinutes={pack.pack.estimatedDurationMinutes}
              adventureType={pack.pack.adventureType}
              place={pack.pack.place}
              href={`/my-adventures/${pack.id}`}
            />
          ))}
        </div>
      )}
    </main>
  )
}
