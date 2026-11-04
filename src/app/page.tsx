'use client'

import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowRight, BookOpen, Puzzle, Scissors, Sprout } from 'lucide-react'
import { Button } from '@/ui/components/button'
import { AdventureCard } from '@/ui/components/adventure-card'
import { AdventureIllustration } from '@/ui/components/adventure-illustration'
import { useHomeData } from '@/ui/hooks/use-home-data'
import type { TemplateListItem } from '@/application/list-templates'
import { useAuth } from '@/ui/hooks/use-auth'
import { getUserGreetingName } from '@/domain/user'

const STEPS = [
  {
    title: 'Nos cuentas',
    text: 'Edades, lugar, temática y tono. Ocho preguntas rápidas, sin datos de los niños.',
  },
  {
    title: 'La IA lo prepara',
    text: 'Historia con narrador, retos con su solución y pistas listas para esconder.',
  },
  {
    title: 'Imprimes y a jugar',
    text: 'Recorta las tarjetas, escóndelas por casa o el parque y empieza la aventura.',
  },
]

const PACK_CONTENTS = [
  {
    icon: BookOpen,
    title: 'Una historia para leer en voz alta',
    text: 'Con un narrador que acompaña a los niños de la primera misión al final.',
    tone: 'bg-sky/25',
  },
  {
    icon: Puzzle,
    title: 'Retos con solución',
    text: 'Acertijos, búsquedas, pruebas físicas o mensajes cifrados, con pistas de menos a más.',
    tone: 'bg-sun/30',
  },
  {
    icon: Scissors,
    title: 'Tarjetas para esconder',
    text: 'Cada pista te dice dónde esconderla. Las imprimes, las recortas y listo.',
    tone: 'bg-tomato/15',
  },
  {
    icon: Sprout,
    title: 'Para pequeños y mayores',
    text: 'Cada reto explica cómo hacerlo más fácil o más difícil según la edad.',
    tone: 'bg-forest/20',
  },
]

function HeroCollage() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[520px]" aria-hidden="true">
      <svg viewBox="0 0 500 400" className="absolute inset-0 h-full w-full overflow-visible">
        <path
          d="M150 395 C200 360 230 380 260 340 S420 330 455 220 S470 90 430 40"
          fill="none"
          stroke="var(--tomato)"
          strokeWidth="4"
          strokeDasharray="12 10"
          strokeLinecap="round"
          className="opacity-70"
        />
        <path d="M418 28 L442 52 M442 28 L418 52" stroke="var(--tomato)" strokeWidth="7" strokeLinecap="round" />
      </svg>

      <div className="washi sticker absolute left-[2%] top-[2%] w-[78%] -rotate-3 overflow-hidden animate-[float_7s_ease-in-out_infinite]">
        <div className="aspect-[400/260]">
          <AdventureIllustration type="mystery" place="garden" />
        </div>
        <p className="border-t-2 border-ink py-2.5 pl-4 pr-[46%] font-display text-base leading-snug sm:text-lg">El misterio de las galletas</p>
      </div>

      <div className="ticket absolute bottom-0 right-0 w-[54%] rotate-[4deg] p-4 shadow-sticker animate-[float_8s_ease-in-out_1s_infinite]">
        <p className="font-hand text-xl leading-tight text-tomato">Pista nº 2</p>
        <p className="mt-1 text-[0.95rem] leading-snug">«Me escondo donde las plantas beben agua…»</p>
        <p className="mt-2 text-xs font-bold text-ink-soft">📍 Esconder: junto a la regadera</p>
      </div>

      <div className="stamp absolute bottom-[1%] left-[6%] hidden h-24 w-24 sm:flex bg-paper/80 text-xl text-forest">
        ¡Misión
        <br />
        cumplida!
      </div>
    </div>
  )
}

function Landing({ onStart, templates }: { onStart: () => void; templates: TemplateListItem[] }) {
  return (
    <>
      <section className="relative overflow-hidden px-4 pb-20 pt-14 md:pb-28 md:pt-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div className="stagger space-y-7">
            <p className="font-hand text-2xl text-tomato md:text-3xl">Sin pantallas · listo en 5 minutos</p>
            <h1 className="text-5xl leading-[1.05] md:text-7xl">
              La magia de jugar juntos, <span className="marker">a un clic de distancia</span>
            </h1>
            <p className="max-w-xl text-xl leading-relaxed text-ink-soft">
              Crea aventuras épicas para tus hijos en minutos. Historia, retos y pistas para esconder por casa o el
              parque: tú lo imprimes, ellos lo viven.
            </p>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Button size="lg" onClick={onStart}>
                ¡Crear mi primera aventura! <ArrowRight />
              </Button>
              <Button size="lg" variant="outline" onClick={onStart}>
                Ya tengo cuenta
              </Button>
            </div>
            <p className="text-sm font-bold text-ink-soft">Gratis · Para niños de 3 a 12 años · Sin guardar datos de los niños</p>
            {templates.length > 0 && (
              <a href="#probar" className="inline-flex items-center gap-1.5 font-hand text-2xl text-forest underline decoration-dashed underline-offset-4 hover:text-tomato">
                o prueba una aventura de ejemplo, sin registrarte <ArrowDown className="h-5 w-5" />
              </a>
            )}
          </div>
          <HeroCollage />
        </div>
      </section>

      <section className="border-y-2 border-ink bg-paper-deep/70 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-hand text-2xl text-tomato">Cómo funciona</p>
          <h2 className="mt-1 text-4xl md:text-5xl">Configuras, la IA crea, vosotros disfrutáis</h2>
          <ol className="relative mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
            <div className="route absolute left-[8%] right-[8%] top-9 hidden md:block" aria-hidden="true" />
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative space-y-4">
                <span className="stamp relative h-[4.5rem] w-[4.5rem] bg-paper text-4xl text-tomato" style={{ transform: `rotate(${index % 2 ? 8 : -10}deg)` }}>
                  {index + 1}
                </span>
                <h3 className="text-2xl">{step.title}</h3>
                <p className="leading-relaxed text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {templates.length > 0 && (
        <section id="probar" className="scroll-mt-20 px-4 pt-24">
          <div className="mx-auto max-w-7xl">
            <p className="font-hand text-2xl text-tomato">Pruébalo ya, sin registrarte</p>
            <h2 className="max-w-3xl text-4xl md:text-5xl">Aventuras listas para imprimir esta misma tarde</h2>
            <p className="mt-4 max-w-2xl text-lg text-ink-soft">
              Abre cualquiera para ver el pack completo: historia, retos con solución y tarjetas para esconder.
            </p>
            <div className="stagger mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <AdventureCard
                  key={template.id}
                  id={template.id}
                  title={template.title}
                  ageRange={template.ageRange}
                  estimatedDurationMinutes={template.estimatedDurationMinutes}
                  adventureType={template.adventureType}
                  place={template.place}
                  href={`/templates/${template.id}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-2xl text-4xl md:text-5xl">Todo lo que necesitas para una aventura épica</h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">Cada pack trae lo necesario para jugar sin preparar nada más.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PACK_CONTENTS.map(({ icon: Icon, title, text, tone }, index) => (
              <article
                key={title}
                className="sticker p-6 transition-transform hover:-translate-y-1"
                style={{ transform: `rotate(${[-1, 0.8, -0.6, 1][index]}deg)` }}
              >
                <span className={`grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink ${tone}`}>
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </span>
                <h3 className="mt-5 text-xl leading-snug">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <figure className="washi sticker mx-auto max-w-3xl rotate-[-0.6deg] px-8 py-12 text-center md:px-16">
          <h2 className="text-3xl md:text-4xl">Para padres, por padres</h2>
          <blockquote className="mt-5 text-lg leading-relaxed text-ink-soft">
            Sabemos que el tiempo libre es oro. Entretemps convierte tu salón, tu jardín o el parque del barrio en el
            escenario de una aventura. Sin pantallas. Sin complicaciones. Solo risas, misiones y momentos que tus hijos
            recordarán.
          </blockquote>
          <figcaption className="mt-6 font-hand text-2xl text-tomato">— usamos la IA para que ellos no la necesiten</figcaption>
        </figure>
      </section>

      <section className="px-4 pb-28">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border-2 border-ink bg-ink px-8 py-16 text-center text-paper shadow-sticker-lg md:px-16">
          <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true">
            <defs>
              <pattern id="stars" width="90" height="90" patternUnits="userSpaceOnUse">
                <path d="M20 10 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2Z" fill="var(--sun)" />
                <circle cx="65" cy="60" r="1.6" fill="var(--paper)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stars)" />
          </svg>
          <div className="relative space-y-6">
            <h2 className="text-4xl md:text-5xl">¿Listo para la primera aventura?</h2>
            <p className="mx-auto max-w-xl text-lg text-paper/80">Únete a las familias que ya crean momentos mágicos con Entretemps.</p>
            <Button size="lg" variant="secondary" onClick={onStart}>
              ¡Vamos allá!
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useHomeData(6)
  const { user } = useAuth()

  const { templates, myAdventures, hasUser } = data

  return (
    <main className="min-h-screen">
      {!hasUser ? (
        <Landing onStart={() => router.push('/login')} templates={templates} />
      ) : (
        <div className="mx-auto max-w-7xl space-y-20 px-4 pb-24 pt-12">
          <section className="stagger grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <p className="font-hand text-2xl text-tomato">Cuaderno de expedición</p>
              <h1 className="text-5xl md:text-6xl">¡Hola, {user ? getUserGreetingName(user) : 'explorador'}! 🗺️</h1>
              <p className="max-w-2xl text-xl text-ink-soft">¿Qué aventura viviremos hoy? Crea una nueva o continúa con tus favoritas.</p>
            </div>
            <Button size="lg" onClick={() => router.push('/wizard/step-1')}>
              ✨ ¡Nueva aventura!
            </Button>
          </section>

          <section>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl">Mis aventuras</h2>
                <p className="mt-1 text-ink-soft">Tus creaciones guardadas</p>
              </div>
              {myAdventures.length > 0 && (
                <Button variant="ghost" onClick={() => router.push('/my-adventures')}>
                  Ver todas <ArrowRight />
                </Button>
              )}
            </div>

            {isLoading ? (
              <p className="py-16 text-center font-hand text-2xl text-ink-soft">Buscando tus aventuras…</p>
            ) : myAdventures.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-ink/40 px-6 py-14 text-center">
                <p className="text-lg text-ink-soft">Aún no has creado ninguna aventura.</p>
                <Button variant="outline" className="mt-5" onClick={() => router.push('/wizard/step-1')}>
                  Crear tu primera aventura
                </Button>
              </div>
            ) : (
              <div className="stagger grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {myAdventures.map((adventure) => (
                  <AdventureCard
                    key={adventure.id}
                    id={adventure.id}
                    title={adventure.title}
                    ageRange={adventure.pack.ageRange}
                    estimatedDurationMinutes={adventure.pack.estimatedDurationMinutes}
                    adventureType={adventure.pack.adventureType}
                    place={adventure.pack.place}
                    href={`/my-adventures/${adventure.id}`}
                  />
                ))}
              </div>
            )}
          </section>

          <section id="plantillas" className="scroll-mt-24">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl">Plantillas</h2>
              <p className="mt-1 text-ink-soft">Aventuras listas para jugar, sin gastar generaciones</p>
            </div>
            <div className="stagger grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {templates.map((template) => (
                <AdventureCard
                  key={template.id}
                  id={template.id}
                  title={template.title}
                  ageRange={template.ageRange}
                  estimatedDurationMinutes={template.estimatedDurationMinutes}
                  adventureType={template.adventureType}
                  place={template.place}
                  href={`/templates/${template.id}`}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
