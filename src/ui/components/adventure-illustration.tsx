// src/ui/components/adventure-illustration.tsx

import type { AdventureType, Place } from '@/domain/wizard-data'
import { cn } from '@/lib/utils'

/**
 * Portada ilustrada de una aventura, sin coste de IA.
 *
 * Se compone de un fondo según el tipo de aventura, un suelo según el lugar
 * (exterior con colinas o interior con suelo de madera y ventana) y un motivo
 * principal dibujado a trazo de tinta.
 */

const INK = 'var(--ink)'

const SKY: Record<AdventureType, string> = {
  mystery: '#2b3f55',
  adventure: '#a9d2e6',
  fantasy: '#c3b0d9',
  action: '#f6d68f',
  humor: '#f6bfab',
}

const OUTDOOR_PLACES: Place[] = ['garden', 'park', 'outdoor']

function Ground({ place }: { place: Place }) {
  if (OUTDOOR_PLACES.includes(place)) {
    return (
      <g>
        <path d="M0 196 Q110 160 210 186 T400 176 V260 H0Z" fill="#9cc29a" stroke={INK} strokeWidth="3" />
        <path d="M0 226 Q130 196 250 220 T400 212 V260 H0Z" fill="var(--forest)" stroke={INK} strokeWidth="3" />
        <g fill={INK} opacity="0.35">
          <circle cx="60" cy="238" r="2" />
          <circle cx="140" cy="232" r="2" />
          <circle cx="300" cy="236" r="2" />
          <circle cx="360" cy="228" r="2" />
        </g>
      </g>
    )
  }

  return (
    <g>
      <rect x="24" y="30" width="62" height="72" rx="4" fill="#fffbf2" stroke={INK} strokeWidth="3" opacity="0.9" />
      <path d="M55 30 V102 M24 66 H86" stroke={INK} strokeWidth="3" />
      <path d="M0 210 H400 V260 H0Z" fill="#c98f5a" stroke={INK} strokeWidth="3" />
      <path d="M0 232 H400 M90 210 V232 M220 232 V260 M310 210 V232" stroke={INK} strokeWidth="2" opacity="0.45" />
    </g>
  )
}

function Sparkle({ x, y, size = 1, fill = 'var(--sun)' }: { x: number; y: number; size?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${size})`}
      d="M0 -12 C2 -3 3 -2 12 0 C3 2 2 3 0 12 C-2 3 -3 2 -12 0 C-3 -2 -2 -3 0 -12Z"
      fill={fill}
      stroke={INK}
      strokeWidth={2 / size}
      strokeLinejoin="round"
    />
  )
}

function MysteryMotif() {
  return (
    <g>
      <circle cx="336" cy="56" r="22" fill="#f4e3b1" stroke={INK} strokeWidth="3" />
      <circle cx="348" cy="48" r="19" fill={SKY.mystery} />
      <Sparkle x={140} y={40} size={0.7} fill="#f4e3b1" />
      <Sparkle x={300} y={120} size={0.6} fill="#f4e3b1" />
      <g fill={INK}>
        {[
          [52, 244, -20],
          [82, 232, -20],
          [112, 226, -10],
          [142, 216, -10],
        ].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y + (i % 2) * 8} rx="7" ry="11" transform={`rotate(${r} ${x} ${y})`} fill="#f5eedf" stroke={INK} strokeWidth="2" />
        ))}
      </g>
      <line x1="248" y1="152" x2="296" y2="200" stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <line x1="252" y1="156" x2="292" y2="196" stroke="var(--tomato)" strokeWidth="9" strokeLinecap="round" />
      <circle cx="214" cy="118" r="52" fill="#d8eef5" fillOpacity="0.85" stroke={INK} strokeWidth="7" />
      <path d="M190 96 Q198 84 212 84" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" />
      <text x="214" y="138" textAnchor="middle" fontFamily="var(--font-display), Georgia, serif" fontSize="58" fill={INK}>
        ?
      </text>
    </g>
  )
}

function AdventureMotif() {
  return (
    <g>
      <circle cx="334" cy="56" r="24" fill="var(--sun)" stroke={INK} strokeWidth="3" />
      <path d="M118 204 L192 88 L266 204Z" fill="#efe5cf" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M174 116 L192 88 L210 116 L200 110 L192 120 L184 110Z" fill="#fff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M214 204 L278 118 L342 204Z" fill="#d8c49c" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="192" y1="88" x2="192" y2="52" stroke={INK} strokeWidth="3" />
      <path d="M192 52 L226 60 L192 70Z" fill="var(--tomato)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path
        d="M30 246 C90 220 120 250 170 236 S250 214 300 232"
        fill="none"
        stroke="var(--tomato)"
        strokeWidth="4"
        strokeDasharray="10 9"
        strokeLinecap="round"
      />
      <path d="M306 222 L328 244 M328 222 L306 244" stroke="var(--tomato)" strokeWidth="6" strokeLinecap="round" />
    </g>
  )
}

function FantasyMotif() {
  return (
    <g>
      <Sparkle x={108} y={48} size={1.1} />
      <Sparkle x={330} y={46} size={0.8} />
      <Sparkle x={110} y={120} size={0.6} fill="#fff" />
      <rect x="150" y="122" width="100" height="88" fill="#f3e9d6" stroke={INK} strokeWidth="3" />
      <rect x="128" y="98" width="32" height="112" fill="#f3e9d6" stroke={INK} strokeWidth="3" />
      <rect x="240" y="98" width="32" height="112" fill="#f3e9d6" stroke={INK} strokeWidth="3" />
      <rect x="184" y="84" width="32" height="40" fill="#f3e9d6" stroke={INK} strokeWidth="3" />
      <path d="M122 98 L144 58 L166 98Z" fill="var(--plum)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M234 98 L256 58 L278 98Z" fill="var(--plum)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M178 84 L200 40 L222 84Z" fill="var(--tomato)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M200 40 V26 L214 31 L200 36" fill="var(--sun)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M184 210 V178 A16 16 0 0 1 216 178 V210Z" fill="var(--ink)" />
      <rect x="138" y="122" width="12" height="16" rx="6" fill={INK} />
      <rect x="250" y="122" width="12" height="16" rx="6" fill={INK} />
    </g>
  )
}

function ActionMotif() {
  return (
    <g>
      <path d="M318 34 L292 92 H314 L298 140 L346 72 H322 L340 34Z" fill="var(--sun)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <g stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.55">
        <line x1="60" y1="190" x2="120" y2="160" />
        <line x1="80" y1="214" x2="128" y2="190" />
        <line x1="44" y1="160" x2="92" y2="136" />
      </g>
      <g transform="translate(196 128) rotate(38)">
        <path d="M-12 44 Q0 98 12 44Z" fill="var(--sun)" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M-6 44 Q0 74 6 44Z" fill="var(--tomato)" />
        <path d="M-20 18 L-42 52 L-18 44Z" fill="var(--tomato)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 18 L42 52 L18 44Z" fill="var(--tomato)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M0 -76 C28 -50 28 20 20 46 H-20 C-28 20 -28 -50 0 -76Z" fill="#f3e9d6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cy="-16" r="13" fill="var(--sky)" stroke={INK} strokeWidth="3" />
        <path d="M-17 -52 Q0 -60 17 -52" stroke={INK} strokeWidth="3" fill="none" />
      </g>
    </g>
  )
}

function HumorMotif() {
  const balloons: Array<[number, number, string]> = [
    [140, 92, 'var(--tomato)'],
    [196, 70, 'var(--sun)'],
    [252, 96, 'var(--sky)'],
  ]
  return (
    <g>
      {balloons.map(([x, y, fill], i) => (
        <g key={i}>
          <path d={`M${x} ${y + 40} C${x - 10} ${y + 80} ${x + 18} ${y + 100} ${200} 196`} stroke={INK} strokeWidth="2" fill="none" />
          <ellipse cx={x} cy={y} rx="30" ry="38" fill={fill} stroke={INK} strokeWidth="3" />
          <path d={`M${x - 6} ${y + 38} L${x} ${y + 46} L${x + 6} ${y + 38}Z`} fill={fill} stroke={INK} strokeWidth="2" />
          <path d={`M${x - 14} ${y - 18} Q${x - 8} ${y - 28} ${x} ${y - 28}`} stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      ))}
      <path d="M170 200 L200 140 L230 200Z" fill="var(--plum)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M186 168 L214 168 M178 184 L222 184" stroke="var(--sun)" strokeWidth="5" />
      <circle cx="200" cy="138" r="8" fill="var(--sun)" stroke={INK} strokeWidth="2.5" />
      <g stroke={INK} strokeWidth="1.5">
        <rect x="104" y="40" width="10" height="16" fill="var(--sun)" transform="rotate(20 109 48)" />
        <rect x="330" y="70" width="10" height="16" fill="var(--tomato)" transform="rotate(-25 335 78)" />
        <rect x="310" y="150" width="10" height="16" fill="var(--forest)" transform="rotate(40 315 158)" />
        <rect x="80" y="150" width="10" height="16" fill="var(--sky)" transform="rotate(-35 85 158)" />
      </g>
    </g>
  )
}

const MOTIFS: Record<AdventureType, () => React.JSX.Element> = {
  mystery: MysteryMotif,
  adventure: AdventureMotif,
  fantasy: FantasyMotif,
  action: ActionMotif,
  humor: HumorMotif,
}

interface AdventureIllustrationProps {
  type: AdventureType
  place: Place
  title?: string
  className?: string
}

export function AdventureIllustration({ type, place, title, className }: AdventureIllustrationProps) {
  const Motif = MOTIFS[type]

  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      className={cn('block h-full w-full', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <rect width="400" height="260" fill={SKY[type]} />
      <Ground place={place} />
      <Motif />
    </svg>
  )
}
