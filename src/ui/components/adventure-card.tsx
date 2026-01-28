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
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image or placeholder */}
        <div className="relative w-full h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl opacity-50">🎭</div>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">
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
