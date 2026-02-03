'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, LogOut, User } from 'lucide-react'
import { Button } from './button'
import { useAuth } from '@/ui/hooks/use-auth'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isLoading, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/my-adventures', label: 'Mis Aventuras', requireAuth: true },
    { href: '/#plantillas', label: 'Plantillas' },
  ]

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-primary">Entre</span>
            <span className="text-foreground">temps</span>
          </Link>

          {/* Desktop Navigation - Only show when user is logged in */}
          {user && (
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                if (link.requireAuth && !user) return null
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isLinkActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoading && (
              user ? (
                <>
                  <Button onClick={() => router.push('/wizard/step-1')} size="sm">
                    Nueva aventura
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="max-w-[150px] truncate">{user.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
                  Iniciar sesión
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Links - Only show when user is logged in */}
            {user && navLinks.map((link) => {
              if (link.requireAuth && !user) return null
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block text-base font-medium transition-colors hover:text-primary ${
                    isLinkActive(link.href) ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* User Section */}
            {!isLoading && (
              <div className="pt-4 border-t border-border space-y-3">
                {user ? (
                  <>
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        router.push('/wizard/step-1')
                      }}
                      className="w-full"
                    >
                      Nueva aventura
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
                      <User className="w-4 h-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <Button variant="outline" onClick={handleSignOut} className="w-full">
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      router.push('/login')
                    }}
                    variant="outline"
                    className="w-full"
                  >
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
