'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'

export function ConditionalNavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const shouldShowNavbar =
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/auth')

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  )
}
