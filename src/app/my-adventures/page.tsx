'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/ui/components/card'
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando aventuras...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => router.push('/')}>Volver al inicio</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Mis Aventuras</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tus creaciones guardadas
            </p>
          </div>
          <Button onClick={() => router.push('/wizard/step-1')}>
            Nueva aventura
          </Button>
        </div>

        {packs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-muted-foreground">
                Todavía no has guardado ninguna aventura.
              </p>
              <Button onClick={() => router.push('/wizard/step-1')}>
                Crear tu primera aventura
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {packs.map((pack) => (
              <AdventureCard
                key={pack.id}
                id={pack.id}
                title={pack.title}
                ageRange={pack.pack.ageRange}
                estimatedDurationMinutes={pack.pack.estimatedDurationMinutes}
                imageUrl={pack.pack.image?.url}
                href={`/my-adventures/${pack.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
