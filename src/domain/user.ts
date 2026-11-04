export type AuthProvider = 'email' | 'google'

export interface User {
  id: string
  email: string
  // Nombre que el adulto quiere ver en la app. Puede venir de Google
  // o editarse en "Mi cuenta". No guardamos ningún dato de los niños.
  displayName?: string | null
  provider?: AuthProvider
}

export const DISPLAY_NAME_MAX_LENGTH = 40

/**
 * Nombre a mostrar: el elegido por el usuario o la parte local del email.
 */
export function getUserGreetingName(user: User): string {
  return user.displayName?.trim() || user.email.split('@')[0]
}

/**
 * Primera palabra del nombre de saludo, para espacios pequeños (la barra
 * de navegación). Así se muestra una palabra entera en vez de un nombre
 * largo recortado con puntos suspensivos.
 */
export function getUserShortName(user: User): string {
  const greeting = getUserGreetingName(user)
  return greeting.split(/[\s._-]+/).find(Boolean) ?? greeting
}
