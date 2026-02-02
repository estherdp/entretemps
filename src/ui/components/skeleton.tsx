// src/ui/components/skeleton.tsx

import { cn } from '@/lib/utils'

/**
 * Componente Skeleton para estados de carga.
 *
 * Muestra un placeholder animado mientras se carga contenido.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

export { Skeleton }
