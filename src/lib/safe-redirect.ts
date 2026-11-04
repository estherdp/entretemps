// src/lib/safe-redirect.ts

/**
 * Devuelve la ruta a la que volver tras el login solo si es interna.
 * Evita redirecciones abiertas del tipo ?next=https://otro-sitio.com o //otro-sitio.com.
 */
export function getSafeRedirectPath(next: string | null | undefined, fallback = '/'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return fallback
  }
  return next
}

/**
 * URL de /auth/callback que conserva la ruta de destino.
 */
export function buildAuthCallbackUrl(origin: string, next?: string | null): string {
  const path = getSafeRedirectPath(next)
  return path === '/' ? `${origin}/auth/callback` : `${origin}/auth/callback?next=${encodeURIComponent(path)}`
}
