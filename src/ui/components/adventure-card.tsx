import { Card, CardContent } from './card'
import Link from 'next/link'

export interface AdventureCardProps {
  id: string
  title: string
  ageRange: { min: number; max: number }
  estimatedDurationMinutes: number
  imageUrl?: string
  href: string
}

export function AdventureCard({
  id,
  title,
  ageRange,
  estimatedDurationMinutes,
  imageUrl,
  href,
}: AdventureCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border-slate-200 dark:border-slate-800">
        {/* Image or placeholder */}
        <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-5xl opacity-40">🎭</div>
            </div>
          )}
        </div>

        {/* Content - Altura fija para consistencia */}
        <CardContent className="p-5 space-y-3 min-h-[110px] flex flex-col justify-between bg-white dark:bg-card">
          <h3 className="font-semibold text-base line-clamp-2 text-slate-900 dark:text-slate-50 group-hover:text-primary transition-colors leading-snug">
            {title}
          </h3>

          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">👥</span>
              <span>
                {ageRange.min}-{ageRange.max} años
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">⏱️</span>
              <span>{estimatedDurationMinutes} min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
