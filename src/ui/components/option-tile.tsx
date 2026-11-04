import type { LucideIcon } from 'lucide-react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const TILT = ['-rotate-1', 'rotate-1', '-rotate-[0.5deg]', 'rotate-[1.5deg]', '-rotate-[1.5deg]']

interface OptionTileProps {
  label: string
  subtitle?: string
  icon?: LucideIcon
  selected: boolean
  onSelect: () => void
  /** Posición en la lista: da a cada pegatina una inclinación distinta al seleccionarla. */
  index?: number
  className?: string
}

/** Opción seleccionable con forma de pegatina. */
export function OptionTile({ label, subtitle, icon: Icon, selected, onSelect, index = 0, className }: OptionTileProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'press relative flex flex-col items-center gap-3 rounded-2xl border-2 border-ink px-3 py-5 text-center',
        selected ? cn('bg-sun shadow-sticker', TILT[index % TILT.length]) : 'bg-card shadow-sticker-sm hover:bg-paper',
        className
      )}
    >
      {selected && (
        <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full border-2 border-ink bg-forest text-paper">
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      )}
      {Icon && (
        <span
          className={cn(
            'grid h-12 w-12 place-items-center rounded-xl border-2 border-ink',
            selected ? 'bg-card' : 'bg-paper-deep'
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </span>
      )}
      <span className="font-bold leading-tight">{label}</span>
      {subtitle && <span className="-mt-2 text-xs text-ink-soft">{subtitle}</span>}
    </button>
  )
}

interface OptionChipProps {
  label: string
  selected?: boolean
  onSelect: () => void
  pressable?: boolean
  /** Símbolo decorativo delante de la etiqueta (no forma parte del nombre accesible). */
  prefix?: string
}

/** Variante compacta tipo etiqueta. */
export function OptionChip({ label, selected = false, onSelect, pressable = true, prefix }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={pressable ? selected : undefined}
      className={cn(
        'press rounded-full border-2 border-ink px-4 py-2 text-sm font-bold',
        selected ? 'bg-ink text-paper shadow-sticker-sm' : 'bg-card hover:bg-sun/40'
      )}
    >
      {prefix && (
        <span aria-hidden="true" className="mr-1 text-tomato">
          {prefix}
        </span>
      )}
      {label}
    </button>
  )
}
