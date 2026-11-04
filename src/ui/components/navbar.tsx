'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, User, Plus } from 'lucide-react'
import { Button } from './button'
import { useAuth } from '@/ui/hooks/use-auth'
import { getUserGreetingName } from '@/domain/user'
import { cn } from '@/lib/utils'

function CompassLogo() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8 shrink-0 transition-transform duration-500 group-hover:rotate-[200deg]" aria-hidden="true">
      <circle cx="20" cy="20" r="17" fill="var(--card)" stroke="var(--ink)" strokeWidth="2.5" />
      <path d="M20 7 L24 20 L20 33 L16 20Z" fill="var(--ink)" />
      <path d="M20 7 L24 20 H16Z" fill="var(--tomato)" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="2.5" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.5" />
    </svg>
  )
}

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/my-adventures', label: 'Mis aventuras' },
  { href: '/#plantillas', label: 'Plantillas' },
]

export function Navbar() {
  const [openForPath, setOpenForPath] = useState<string | null>(null)
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // El menú móvil se cierra solo al cambiar de ruta
  const isMobileMenuOpen = openForPath === pathname

  const isLinkActive = (href: string) =>
    href === '/' ? pathname === '/' : !href.includes('#') && pathname.startsWith(href)

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="Entretemps, inicio">
            <CompassLogo />
            <span className="font-display text-2xl leading-none">Entretemps</span>
          </Link>

          {user && (
            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors hover:bg-ink/5',
                    isLinkActive(link.href) && 'bg-ink text-paper hover:bg-ink'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <div className="hidden items-center gap-3 md:flex">
            {!isLoading &&
              (user ? (
                <>
                  <Button onClick={() => router.push('/wizard/step-1')} size="sm">
                    <Plus /> Nueva aventura
                  </Button>
                  <Link
                    href="/account"
                    title="Mi cuenta"
                    className={cn(
                      'flex items-center gap-2 rounded-full border-2 border-ink bg-card py-1 pl-1 pr-3 text-sm font-bold transition-shadow hover:shadow-sticker-sm',
                      pathname === '/account' && 'bg-sun'
                    )}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-paper">
                      <User className="h-4 w-4" />
                    </span>
                    <span className="max-w-[140px] truncate">{getUserGreetingName(user)}</span>
                  </Link>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
                  Iniciar sesión
                </Button>
              ))}
          </div>

          <button
            onClick={() => setOpenForPath(isMobileMenuOpen ? null : pathname)}
            className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-card md:hidden"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t-2 border-ink bg-paper md:hidden">
          <div className="space-y-2 px-4 py-5">
            {user &&
              NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpenForPath(null)}
                  className={cn(
                    'block rounded-xl px-3 py-2 font-display text-xl',
                    isLinkActive(link.href) && 'bg-ink text-paper'
                  )}
                >
                  {link.label}
                </Link>
              ))}

            {!isLoading && (
              <div className="space-y-3 border-t-2 border-dashed border-ink/30 pt-4">
                {user ? (
                  <>
                    <Button onClick={() => router.push('/wizard/step-1')} className="w-full">
                      <Plus /> Nueva aventura
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/account')} className="w-full">
                      <User /> Mi cuenta · {getUserGreetingName(user)}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => router.push('/login')} variant="outline" className="w-full">
                    Iniciar sesión
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
