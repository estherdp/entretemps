// src/proxy.ts

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Proxy de Next.js 16 (antes "middleware").
 *
 * 1. Refresca la sesión de Supabase en cada petición, para que las API routes
 *    reciban siempre un token válido en las cookies.
 * 2. Redirige a /login las páginas privadas si no hay usuario.
 */
const PROTECTED_PAGES = ['/wizard', '/my-adventures', '/account', '/pack']

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isProtectedPage = PROTECTED_PAGES.some((page) => pathname === page || pathname.startsWith(`${page}/`))

  if (!user && isProtectedPage) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.search = ''
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/wizard/:path*', '/my-adventures/:path*', '/account', '/pack/:path*', '/api/:path*'],
}
