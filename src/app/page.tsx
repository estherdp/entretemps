'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/ui/components/button'
import { AdventureCard } from '@/ui/components/adventure-card'
import { useHomeData } from '@/ui/hooks/use-home-data'

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useHomeData(6)

  const { templates, myAdventures, hasUser } = data

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="px-4 py-12 md:py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Bienvenido a Entretemps
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Crea experiencias tipo escape room únicas para tu familia. Explora plantillas o diseña tu propia aventura.
        </p>
        <Button size="lg" onClick={() => router.push('/wizard/step-1')}>
          ✨ Crear nueva aventura
        </Button>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-16 space-y-12">
        {/* Mis Aventuras */}
        {hasUser && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Mis Aventuras</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Tus creaciones guardadas
                </p>
              </div>
              {myAdventures.length > 6 && (
                <Button variant="ghost" onClick={() => router.push('/my-adventures')}>
                  Ver todas →
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Cargando aventuras...
              </div>
            ) : myAdventures.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">Aún no has creado ninguna aventura.</p>
                <Button variant="outline" onClick={() => router.push('/wizard/step-1')}>
                  Crear tu primera aventura
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myAdventures.map((adventure) => (
                  <AdventureCard
                    key={adventure.id}
                    id={adventure.id}
                    title={adventure.title}
                    ageRange={adventure.pack.ageRange}
                    estimatedDurationMinutes={adventure.pack.estimatedDurationMinutes}
                    imageUrl={adventure.pack.image?.url}
                    href={`/my-adventures/${adventure.id}`}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Plantillas */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Plantillas</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Aventuras listas para jugar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <AdventureCard
                key={template.id}
                id={template.id}
                title={template.title}
                ageRange={template.ageRange}
                estimatedDurationMinutes={template.estimatedDurationMinutes}
                imageUrl={template.image?.url}
                href={`/templates/${template.id}`}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
