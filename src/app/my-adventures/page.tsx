'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/components/card'
import { Button } from '@/ui/components/button'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'
import { getCurrentUser } from '@/infrastructure/supabase/auth'
import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { listMyAdventurePacks } from '@/application/list-my-adventure-packs'

export default function MyAdventuresPage() {
  const router = useRouter()
  const [packs, setPacks] = useState<SavedAdventurePack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPacks() {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push('/login')
          return
        }

        const repository = new AdventurePackRepository()
        const userPacks = await listMyAdventurePacks(user.id, repository)
        setPacks(userPacks)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar packs')
      } finally {
        setIsLoading(false)
      }
    }

    loadPacks()
  }, [router])

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
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mis Aventuras</h1>
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
          <div className="grid gap-4">
            {packs.map((pack) => (
              <Card
                key={pack.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/my-adventures/${pack.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{pack.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        {pack.pack.ageRange.min}-{pack.pack.ageRange.max} años •{' '}
                        {pack.pack.estimatedDurationMinutes} min •{' '}
                        {pack.pack.participants} participantes
                      </p>
                    </div>
                    {pack.pack.image.url && (
                      <img
                        src={pack.pack.image.url}
                        alt={pack.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Creado el{' '}
                    {new Date(pack.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
