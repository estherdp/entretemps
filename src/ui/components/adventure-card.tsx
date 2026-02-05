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
      <Card className="overflow-hidden rounded-2xl shadow-premium hover:shadow-premium-lg hover:scale-105 active:scale-95 transition-all duration-200 border-border/60">
        {/* Image or placeholder */}
        <div className="relative w-full h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl opacity-50">🎭</div>
            </div>
          )}
        </div>

        {/* Content - Altura fija para consistencia */}
        <CardContent className="p-4 space-y-2 min-h-[100px] flex flex-col justify-between">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>
                {ageRange.min}-{ageRange.max} años
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{estimatedDurationMinutes} min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
