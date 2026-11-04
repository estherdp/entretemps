// src/domain/errors.ts

/**
 * El proveedor de IA ha rechazado la petición por límite de uso
 * (p. ej. HTTP 429 en el tier gratuito de Gemini).
 *
 * Los adaptadores traducen los errores específicos de cada SDK a este
 * error de dominio para que las capas superiores no dependan del proveedor.
 */
export class AIProviderQuotaError extends Error {
  constructor(message = 'El proveedor de IA ha alcanzado su límite de uso') {
    super(message)
    this.name = 'AIProviderQuotaError'
  }
}

/**
 * El usuario ha agotado su cuota diaria de generaciones.
 */
export class UserQuotaExceededError extends Error {
  constructor(
    public readonly limit: number,
    message = `Has alcanzado el límite de ${limit} generaciones en 24 horas`
  ) {
    super(message)
    this.name = 'UserQuotaExceededError'
  }
}
