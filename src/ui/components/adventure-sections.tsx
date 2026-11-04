// src/ui/components/adventure-sections.tsx
//
// Piezas de presentación compartidas por todas las vistas de una aventura
// (resultado recién generado, plantilla y aventura guardada). Solo pintan:
// la lógica de cada página vive en la propia página.

import type { ReactNode } from 'react'
import { Check, Clock, Gauge, Smile, Users } from 'lucide-react'
import type { GeneratedAdventurePack, GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'
import { AdventureIllustration } from '@/ui/components/adventure-illustration'
import { MissionPlayDetails } from '@/ui/components/mission-play-details'
import { ADVENTURE_TYPE_LABELS, DIFFICULTY_LABELS, PLACE_LABELS, TONE_LABELS } from '@/ui/wizard/labels'
import { cn } from '@/lib/utils'

type HeroPack = Pick<
  GeneratedAdventurePack,
  'adventureType' | 'place' | 'tone' | 'difficulty' | 'ageRange' | 'estimatedDurationMinutes' | 'participants'
>

interface AdventureHeroProps {
  pack: HeroPack
  /** Texto pequeño manuscrito sobre el título. */
  kicker: string
  /** Título, o un campo editable en su lugar. */
  title: ReactNode
  /** Botones de acción bajo los datos. */
  actions?: ReactNode
}

export function AdventureHero({ pack, kicker, title, actions }: AdventureHeroProps) {
  const stats = [
    { icon: Users, label: 'Edades', value: `${pack.ageRange.min}-${pack.ageRange.max}`, unit: 'años' },
    { icon: Clock, label: 'Duración', value: `${pack.estimatedDurationMinutes}`, unit: 'min' },
    { icon: Smile, label: 'Jugadores', value: `${pack.participants}`, unit: 'niños' },
    { icon: Gauge, label: 'Dificultad', value: DIFFICULTY_LABELS[pack.difficulty], unit: '' },
  ]

  return (
    <header className="print-avoid-break grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div className="stagger space-y-6">
        <p className="font-hand text-2xl text-tomato">{kicker}</p>
        {title}
        <div className="flex flex-wrap gap-2">
          {[ADVENTURE_TYPE_LABELS[pack.adventureType], TONE_LABELS[pack.tone], PLACE_LABELS[pack.place]].map((tag, i) => (
            <span
              key={tag}
              className={cn(
                'rounded-full border-2 border-ink px-3 py-0.5 text-sm font-bold',
                ['bg-sun', 'bg-card', 'bg-paper-deep'][i]
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-3">
          {stats.map(({ icon: Icon, label, value, unit }) => (
            <div key={label} className="min-w-0 rounded-xl border-2 border-ink bg-card px-3 py-2.5">
              <dt className="flex min-w-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink-soft">
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </dt>
              <dd className="mt-0.5 font-display text-xl">
                {value}
                {unit && <span className="ml-1 font-sans text-sm text-ink-soft">{unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
        {actions && <div className="no-print flex flex-wrap gap-3">{actions}</div>}
      </div>

      <div className="washi sticker no-print mx-auto w-full max-w-[520px] rotate-2 overflow-hidden" aria-hidden="true">
        <div className="aspect-[400/260]">
          <AdventureIllustration type={pack.adventureType} place={pack.place} />
        </div>
      </div>
    </header>
  )
}

interface SectionProps {
  kicker?: string
  title: string
  aside?: ReactNode
  children: ReactNode
  className?: string
}

/** Bloque con encabezado de cuaderno: nota manuscrita + título serif. */
export function AdventureSection({ kicker, title, aside, children, className }: SectionProps) {
  return (
    <section className={cn('space-y-5', className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {kicker && <p className="font-hand text-xl text-tomato">{kicker}</p>}
          <h2 className="text-3xl md:text-4xl">{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  )
}

/** Texto para leer en voz alta a los niños. */
export function ReadAloud({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative border-l-4 border-dotted border-tomato pl-5', className)}>
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-tomato">Para leer en voz alta</p>
      <div className="whitespace-pre-line text-lg leading-relaxed">{children}</div>
    </div>
  )
}

/** Nota para el adulto que dirige el juego (tipo pósit). */
export function ParentNote({ title = 'Guía para padres', children, tone = 'sun' }: { title?: string; children: ReactNode; tone?: 'sun' | 'sky' | 'plum' }) {
  const tones = {
    sun: 'bg-sun/20 border-sun',
    sky: 'bg-sky/10 border-sky',
    plum: 'bg-plum/10 border-plum',
  }
  return (
    <div className={cn('print-avoid-break rounded-xl border-2 border-dashed p-4', tones[tone])}>
      <p className="mb-1.5 font-hand text-xl leading-none">{title}</p>
      <div className="text-[0.95rem] leading-relaxed text-ink/90">{children}</div>
    </div>
  )
}

interface StoryBlockProps {
  story: string
  note: string
  /** Sustitutos editables de la historia o de la nota. */
  storySlot?: ReactNode
  noteSlot?: ReactNode
}

export function IntroductionSection({ story, note, storySlot, noteSlot }: StoryBlockProps) {
  return (
    <AdventureSection kicker="Capítulo 0" title="La aventura comienza">
      <div className="sticker space-y-5 p-5 sm:p-7">
        {storySlot ?? <ReadAloud>{story}</ReadAloud>}
        <ParentNote>{noteSlot ?? note}</ParentNote>
      </div>
    </AdventureSection>
  )
}

export function ConclusionSection({ story, note, storySlot, noteSlot }: StoryBlockProps) {
  return (
    <AdventureSection kicker="Fin del viaje" title="Final de la aventura">
      <div className="sticker space-y-5 p-5 sm:p-7">
        {storySlot ?? <ReadAloud>{story}</ReadAloud>}
        <ParentNote title="Para celebrarlo" tone="plum">
          {noteSlot ?? note}
        </ParentNote>
      </div>
    </AdventureSection>
  )
}

export function MaterialsChecklist({ materials }: { materials: string[] }) {
  if (materials.length === 0) return null
  return (
    <AdventureSection kicker="Antes de empezar" title="Materiales">
      <ul className="sticker grid gap-x-8 gap-y-1 p-5 sm:grid-cols-2">
        {materials.map((material, idx) => (
          <li key={idx} className="flex items-center gap-3 border-b-2 border-dashed border-ink/15 py-2 last:border-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-0">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded border-2 border-ink" aria-hidden="true" />
            <span>{material}</span>
          </li>
        ))}
      </ul>
    </AdventureSection>
  )
}

/** Número de misión con forma de sello. */
export function MissionStamp({ order, className }: { order: number; className?: string }) {
  return (
    <span
      className={cn('stamp h-14 w-14 shrink-0 bg-card text-3xl text-tomato', className)}
      style={{ transform: `rotate(${order % 2 ? -8 : 6}deg)` }}
      aria-label={`Misión ${order}`}
    >
      {order}
    </span>
  )
}

interface MissionBodyProps {
  mission: GeneratedAdventurePackMission
  /** Sustituye la historia (por ejemplo, por un textarea en modo edición). */
  story?: ReactNode
}

/** Contenido completo de una misión. */
export function MissionBody({ mission, story }: MissionBodyProps) {
  return (
    <div className="space-y-5">
      {story ?? <ReadAloud>{mission.story}</ReadAloud>}
      <ParentNote tone="sky">{mission.parentGuide}</ParentNote>
      <p className="flex items-start gap-2.5 rounded-xl border-2 border-forest bg-forest/10 p-3 text-[0.95rem] leading-relaxed">
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-forest" strokeWidth={3} aria-hidden="true" />
        <span>
          <span className="font-bold">Misión completada cuando:</span> {mission.successCondition}
        </span>
      </p>
      <MissionPlayDetails mission={mission} />
    </div>
  )
}

/** Misión completa en formato de tarjeta (para vistas de solo lectura). */
export function MissionSheet({ mission }: { mission: GeneratedAdventurePackMission }) {
  return (
    <article className="sticker print-break-before p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-4">
        <MissionStamp order={mission.order} />
        <h3 className="text-2xl leading-tight md:text-3xl">{mission.title}</h3>
      </div>
      <MissionBody mission={mission} />
    </article>
  )
}

export function sortMissions<T extends { order: number }>(missions: T[]): T[] {
  return [...missions].sort((a, b) => a.order - b.order)
}

/** Página centrada con el ancho de lectura de las vistas de aventura. */
export function AdventurePage({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-5xl space-y-16 px-4 pb-24 pt-10 md:pt-14">{children}</main>
}

export function CenteredMessage({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-4 text-center">{children}</div>
}
