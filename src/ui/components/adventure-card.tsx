import Link from 'next/link'
import { Clock, Users } from 'lucide-react'
import type { AdventureType, Place } from '@/domain/wizard-data'
import { ADVENTURE_TYPE_LABELS } from '@/ui/wizard/labels'
import { AdventureIllustration } from './adventure-illustration'

export interface AdventureCardProps {
  id: string
  title: string
  ageRange: { min: number; max: number }
  estimatedDurationMinutes: number
  adventureType: AdventureType
  place: Place
  href: string
}

export function AdventureCard({
  title,
  ageRange,
  estimatedDurationMinutes,
  adventureType,
  place,
  href,
}: AdventureCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl focus-visible:outline-offset-4"
    >
      <article className="sticker h-full overflow-hidden transition-transform duration-200 group-hover:-translate-y-1 group-hover:-rotate-[0.6deg] group-hover:shadow-sticker-lg">
        <div className="relative aspect-[400/240] border-b-2 border-ink overflow-hidden">
          <AdventureIllustration
            type={adventureType}
            place={place}
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <span className="absolute left-3 top-3 rounded-full border-2 border-ink bg-card px-2.5 py-0.5 font-hand text-lg leading-tight">
            {ADVENTURE_TYPE_LABELS[adventureType]}
          </span>
        </div>

        <div className="flex min-h-[112px] flex-col justify-between gap-3 p-4">
          <h3 className="text-lg leading-snug group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-4 text-sm font-bold text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" aria-hidden="true" />
              {ageRange.min}-{ageRange.max} años
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {estimatedDurationMinutes} min
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
