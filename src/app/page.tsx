'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/ui/components/button'
import { Card, CardContent } from '@/ui/components/card'
import { AdventureCard } from '@/ui/components/adventure-card'
import { useHomeData } from '@/ui/hooks/use-home-data'
import { Star, Heart, Compass, Wand2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useHomeData(6)

  const { templates, myAdventures, hasUser } = data

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section - Different content based on auth */}
      {!hasUser ? (
        // Landing page for non-authenticated users
        <>
          <section className="relative px-4 pt-20 pb-16 md:pt-32 md:pb-24 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-50 dark:from-orange-950/10 to-transparent pointer-events-none" />
            <div className="relative max-w-4xl mx-auto space-y-6">
              <span className="inline-block text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/30 px-4 py-1.5 rounded-full">
                ✨ Entretemps
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                La magia de jugar juntos,{' '}
                <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                  a un clic de distancia
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Crea aventuras épicas para tus hijos en minutos. Sin pantallas, sin complicaciones — solo risas y momentos inolvidables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" onClick={() => router.push('/login')} className="rounded-2xl text-base px-8">
                  ¡Crear mi primera aventura!
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push('/login')} className="rounded-2xl text-base px-8">
                  Ya tengo cuenta
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-4 pb-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-3">
                Todo lo que necesitas para una aventura épica
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
                Configuras, la IA crea, vosotros disfrutáis.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="rounded-3xl">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                    </div>
                    <h3 className="font-semibold">Aventuras únicas en minutos</h3>
                    <p className="text-sm text-muted-foreground">
                      La IA diseña historias, puzzles y personajes adaptados a tu familia. Tú solo disfrutas.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-rose-500 dark:text-rose-400" />
                    </div>
                    <h3 className="font-semibold">Hecha para tu familia</h3>
                    <p className="text-sm text-muted-foreground">
                      Adapta cada aventura a las edades e intereses de tus hijos. Siempre a su medida.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center">
                      <Compass className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="font-semibold">Explora cualquier espacio</h3>
                    <p className="text-sm text-muted-foreground">
                      Casa, jardín, parque... transforma tu entorno cotidiano en el escenario de una épica misión.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Wand2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold">Tú tienes el control</h3>
                    <p className="text-sm text-muted-foreground">
                      Edita, mejora y personaliza cada misión antes del gran día. Con un toque de magia.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Para padres, por padres */}
          <section className="px-4 pb-16">
            <div className="max-w-3xl mx-auto text-center space-y-4 bg-gradient-to-br from-orange-50 to-amber-50/40 dark:from-orange-950/20 dark:to-amber-950/10 rounded-3xl p-8 md:p-12">
              <span className="text-3xl">🏠</span>
              <h2 className="text-2xl md:text-3xl font-bold">
                Para padres, por padres
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Sabemos que el tiempo libre es oro. Entretemps convierte tu salón, tu jardín o el parque del barrio en el escenario de una aventura épica. Sin pantallas. Sin complicaciones. Solo risas, misiones y momentos que tus hijos recordarán para siempre.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 pb-20">
            <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold">
                ¿Listo para la primera aventura?
              </h2>
              <p className="text-muted-foreground">
                Únete a las familias que ya crean momentos mágicos con Entretemps.
              </p>
              <Button size="lg" onClick={() => router.push('/login')} className="rounded-2xl text-base px-8">
                ¡Vamos allá!
              </Button>
            </div>
          </section>
        </>
      ) : (
        // Authenticated user - home page
        <section className="px-4 pt-20 pb-12 md:pt-24 md:pb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ¡Hola, explorador! 🗺️
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            ¿Qué aventura viviremos hoy? Crea una nueva o continúa con tus favoritas.
          </p>
          <Button size="lg" onClick={() => router.push('/wizard/step-1')} className="rounded-2xl">
            ✨ ¡Nueva aventura!
          </Button>
        </section>
      )}

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
                Buscando tus aventuras...
              </div>
            ) : myAdventures.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">Aún no has creado ninguna aventura.</p>
                <Button variant="outline" onClick={() => router.push('/wizard/step-1')} className="rounded-2xl">
                  Crear tu primera aventura
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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

        {/* Plantillas - Only for authenticated users */}
        {hasUser && (
          <section id="plantillas">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Plantillas</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Aventuras listas para jugar
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
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
        )}
      </div>
    </main>
  )
}
