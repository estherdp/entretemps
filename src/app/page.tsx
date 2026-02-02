'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/ui/components/button'
import { Card, CardContent } from '@/ui/components/card'
import { AdventureCard } from '@/ui/components/adventure-card'
import { useHomeData } from '@/ui/hooks/use-home-data'
import { Sparkles, Users, Wand2, BookOpen } from 'lucide-react'

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
          <section className="px-4 pt-20 pb-12 md:pt-32 md:pb-20 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Entretemps
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Aventuras infantiles personalizadas con IA
              </p>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Crea experiencias tipo escape room únicas para niños. Diseña misiones personalizadas según edad,
                intereses y lugar, generadas inteligentemente con IA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" onClick={() => router.push('/login')}>
                  Iniciar Sesión
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push('/login')}>
                  Registrarse
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-4 pb-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                ¿Qué puedes hacer con Entretemps?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold">Generación con IA</h3>
                    <p className="text-sm text-muted-foreground">
                      Aventuras únicas generadas con inteligencia artificial adaptadas a tus preferencias
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold">Personalización</h3>
                    <p className="text-sm text-muted-foreground">
                      Ajusta edad, dificultad, temática y lugar para crear la experiencia perfecta
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Wand2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold">Edición Human-in-the-Loop</h3>
                    <p className="text-sm text-muted-foreground">
                      Regenera misiones, reordena y ajusta el contenido con ayuda de IA
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-semibold">Guías para Padres</h3>
                    <p className="text-sm text-muted-foreground">
                      Cada misión incluye instrucciones detalladas y tips para facilitar la experiencia
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 pb-20">
            <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold">
                ¿Listo para crear tu primera aventura?
              </h2>
              <p className="text-muted-foreground">
                Únete a Entretemps y descubre cómo la IA puede ayudarte a crear experiencias inolvidables para los más pequeños.
              </p>
              <Button size="lg" onClick={() => router.push('/login')}>
                Comenzar Ahora
              </Button>
            </div>
          </section>
        </>
      ) : (
        // Authenticated user - original home page
        <section className="px-4 pt-20 pb-12 md:pt-24 md:pb-16 text-center">
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
