'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'

export function ConditionalNavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Only hide navbar on auth callback pages (not on login page)
  const shouldShowNavbar = !pathname.startsWith('/auth/callback')

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  )
}
