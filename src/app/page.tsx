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
    <main className="min-h-screen bg-white dark:bg-background">
      {/* Hero Section - Different content based on auth */}
      {!hasUser ? (
        // Landing page for non-authenticated users
        <>
          <section className="relative px-4 pt-24 pb-20 md:pt-40 md:pb-32 text-center">
            <div className="relative max-w-5xl mx-auto space-y-8">
              <span className="inline-block text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-400 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800">
                Entretemps
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-slate-50 max-w-4xl mx-auto">
                La magia de jugar juntos,{' '}
                <span className="text-slate-900 dark:text-slate-50">
                  a un clic de distancia
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Crea aventuras épicas para tus hijos en minutos. Sin pantallas, sin complicaciones — solo risas y momentos inolvidables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button size="lg" onClick={() => router.push('/login')} className="rounded-xl text-base px-10 h-14 font-semibold shadow-lg hover:shadow-xl transition-all">
                  ¡Crear mi primera aventura!
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push('/login')} className="rounded-xl text-base px-10 h-14 font-semibold border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900">
                  Ya tengo cuenta
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-4 pb-24">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-slate-900 dark:text-slate-50 tracking-tight">
                Todo lo que necesitas para una aventura épica
              </h2>
              <p className="text-center text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto text-lg">
                Configuras, la IA crea, vosotros disfrutáis.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
                  <CardContent className="pt-8 pb-6 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                      <Star className="w-7 h-7 text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-lg">Aventuras únicas en minutos</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      La IA diseña historias, puzzles y personajes adaptados a tu familia. Tú solo disfrutas.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
                  <CardContent className="pt-8 pb-6 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                      <Heart className="w-7 h-7 text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-lg">Hecha para tu familia</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Adapta cada aventura a las edades e intereses de tus hijos. Siempre a su medida.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
                  <CardContent className="pt-8 pb-6 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                      <Compass className="w-7 h-7 text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-lg">Explora cualquier espacio</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Casa, jardín, parque... transforma tu entorno cotidiano en el escenario de una épica misión.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
                  <CardContent className="pt-8 pb-6 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors">
                      <Wand2 className="w-7 h-7 text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 text-lg">Tú tienes el control</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Edita, mejora y personaliza cada misión antes del gran día. Con un toque de magia.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Para padres, por padres */}
          <section className="px-4 pb-24">
            <div className="max-w-4xl mx-auto text-center space-y-6 bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-12 md:p-16 border border-slate-200 dark:border-slate-800">
              <span className="text-4xl">🏠</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                Para padres, por padres
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Sabemos que el tiempo libre es oro. Entretemps convierte tu salón, tu jardín o el parque del barrio en el escenario de una aventura épica. Sin pantallas. Sin complicaciones. Solo risas, misiones y momentos que tus hijos recordarán para siempre.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4 pb-32">
            <div className="max-w-4xl mx-auto text-center space-y-8 bg-slate-900 dark:bg-slate-800 rounded-3xl p-12 md:p-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                ¿Listo para la primera aventura?
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Únete a las familias que ya crean momentos mágicos con Entretemps.
              </p>
              <Button size="lg" onClick={() => router.push('/login')} className="rounded-xl text-base px-10 h-14 font-semibold bg-white text-slate-900 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all">
                ¡Vamos allá!
              </Button>
            </div>
          </section>
        </>
      ) : (
        // Authenticated user - home page
        <section className="px-4 pt-24 pb-16 md:pt-32 md:pb-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-slate-50 tracking-tight">
            ¡Hola, explorador! 🗺️
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            ¿Qué aventura viviremos hoy? Crea una nueva o continúa con tus favoritas.
          </p>
          <Button size="lg" onClick={() => router.push('/wizard/step-1')} className="rounded-xl text-base px-10 h-14 font-semibold shadow-lg hover:shadow-xl transition-all">
            ✨ ¡Nueva aventura!
          </Button>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-20">
        {/* Mis Aventuras */}
        {hasUser && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Mis Aventuras</h2>
                <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
                  Tus creaciones guardadas
                </p>
              </div>
              {myAdventures.length > 6 && (
                <Button variant="ghost" onClick={() => router.push('/my-adventures')} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
                  Ver todas →
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                Buscando tus aventuras...
              </div>
            ) : myAdventures.length === 0 ? (
              <div className="text-center py-16">
                <p className="mb-6 text-slate-600 dark:text-slate-400 text-lg">Aún no has creado ninguna aventura.</p>
                <Button variant="outline" onClick={() => router.push('/wizard/step-1')} className="rounded-xl h-12 px-8 font-semibold border-slate-300 dark:border-slate-700">
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
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Plantillas</h2>
              <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
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
