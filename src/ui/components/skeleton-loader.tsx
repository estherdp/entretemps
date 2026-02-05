/**
 * Skeleton Loader Premium
 *
 * Componente de carga elegante que se muestra mientras se genera
 * la aventura con IA. Transmite profesionalidad y calma.
 */

import { Sparkles } from 'lucide-react'

interface SkeletonLoaderProps {
  message?: string
}

export function SkeletonLoader({ message = 'Generando tu aventura mágica...' }: SkeletonLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-2xl w-full space-y-8">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 shadow-premium-lg">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{message}</h2>
          <p className="text-muted-foreground">
            Estamos creando una experiencia única personalizada para ti
          </p>
        </div>

        {/* Skeleton Cards */}
        <div className="space-y-4">
          {/* Title skeleton */}
          <div className="bg-card rounded-2xl p-6 shadow-premium border border-border/60 space-y-4 animate-pulse">
            <div className="h-8 bg-muted/60 rounded-lg w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted/40 rounded w-full" />
              <div className="h-4 bg-muted/40 rounded w-5/6" />
            </div>
          </div>

          {/* Missions skeleton */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-6 shadow-premium border border-border/60 space-y-3 animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full" />
                <div className="h-5 bg-muted/50 rounded w-1/3" />
              </div>
              <div className="space-y-2 pl-13">
                <div className="h-3 bg-muted/30 rounded w-full" />
                <div className="h-3 bg-muted/30 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 animate-[shimmer_2s_ease-in-out_infinite] w-1/2" />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Esto puede tardar 10-30 segundos
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton Card Component
 *
 * Componente reutilizable para mostrar placeholders de carga
 * en cualquier parte de la aplicación.
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-card rounded-2xl p-6 shadow-premium border border-border/60 space-y-4 animate-pulse ${className}`}
    >
      <div className="h-6 bg-muted/50 rounded w-2/3" />
      <div className="space-y-2">
        <div className="h-4 bg-muted/30 rounded w-full" />
        <div className="h-4 bg-muted/30 rounded w-5/6" />
        <div className="h-4 bg-muted/30 rounded w-4/5" />
      </div>
    </div>
  )
}

// Add shimmer animation to globals.css if not present:
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
