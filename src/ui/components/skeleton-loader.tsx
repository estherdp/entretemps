/**
 * Pantalla de espera mientras la IA genera la aventura.
 * Una brújula que gira y un mapa que se va dibujando: transmite calma
 * y deja claro qué se está preparando.
 */

const PREPARING = ['Escribiendo la historia', 'Inventando los retos', 'Escondiendo las pistas']

interface SkeletonLoaderProps {
  message?: string
}

export function SkeletonLoader({ message = 'Preparando las pistas secretas...' }: SkeletonLoaderProps) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4" role="status" aria-live="polite">
      <div className="w-full max-w-xl space-y-10 text-center">
        <svg viewBox="0 0 160 160" className="mx-auto h-36 w-36" aria-hidden="true">
          <circle cx="80" cy="80" r="66" fill="var(--card)" stroke="var(--ink)" strokeWidth="4" />
          <circle cx="80" cy="80" r="54" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 7" />
          {['N', 'E', 'S', 'O'].map((label, i) => (
            <text
              key={label}
              x={80 + 42 * Math.sin((i * Math.PI) / 2)}
              y={86 - 42 * Math.cos((i * Math.PI) / 2)}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="var(--ink-soft)"
            >
              {label}
            </text>
          ))}
          <g className="origin-center animate-[spin_3s_cubic-bezier(.6,0,.4,1)_infinite]" style={{ transformBox: 'view-box' }}>
            <path d="M80 30 L90 80 L80 130 L70 80Z" fill="var(--ink)" />
            <path d="M80 30 L90 80 H70Z" fill="var(--tomato)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
          </g>
          <circle cx="80" cy="80" r="6" fill="var(--sun)" stroke="var(--ink)" strokeWidth="2.5" />
        </svg>

        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl">{message}</h2>
          <p className="font-hand text-2xl text-tomato">La magia lleva su tiempo… ¡ya casi!</p>
        </div>

        <ol className="sticker mx-auto max-w-sm space-y-3 p-5 text-left">
          {PREPARING.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span
                className="h-3 w-3 shrink-0 animate-pulse rounded-full border-2 border-ink bg-sun"
                style={{ animationDelay: `${i * 400}ms` }}
              />
              <span className="font-bold">{step}…</span>
            </li>
          ))}
        </ol>

        <svg viewBox="0 0 400 40" className="mx-auto w-full max-w-md" aria-hidden="true">
          <path
            d="M10 30 C80 0 140 40 200 18 S330 0 390 22"
            fill="none"
            stroke="var(--tomato)"
            strokeWidth="4"
            strokeDasharray="12 10"
            strokeLinecap="round"
            className="animate-[dash_1.2s_linear_infinite]"
          />
        </svg>
      </div>
    </div>
  )
}

/** Placeholder de carga reutilizable. */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`sticker animate-pulse space-y-4 p-6 ${className}`}>
      <div className="h-6 w-2/3 rounded bg-paper-deep" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-paper-deep/70" />
        <div className="h-4 w-5/6 rounded bg-paper-deep/70" />
        <div className="h-4 w-4/5 rounded bg-paper-deep/70" />
      </div>
    </div>
  )
}
