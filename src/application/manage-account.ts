// src/application/manage-account.ts

import type { IAccountService } from '@/domain/services'
import { DISPLAY_NAME_MAX_LENGTH } from '@/domain/user'

/**
 * Texto que el usuario debe escribir para confirmar el borrado de la cuenta.
 */
export const DELETE_ACCOUNT_CONFIRMATION = 'BORRAR'

/**
 * Caso de Uso: Cambiar el nombre visible del usuario.
 *
 * @throws Error si el nombre está vacío o es demasiado largo
 */
export async function updateDisplayName(rawName: string, accountService: IAccountService): Promise<string> {
  const displayName = rawName.trim().replace(/\s+/g, ' ')

  if (!displayName) {
    throw new Error('El nombre no puede estar vacío')
  }

  if (displayName.length > DISPLAY_NAME_MAX_LENGTH) {
    throw new Error(`El nombre no puede superar ${DISPLAY_NAME_MAX_LENGTH} caracteres`)
  }

  await accountService.updateDisplayName(displayName)
  return displayName
}

/**
 * Caso de Uso: Borrar la cuenta del usuario.
 *
 * Exige la confirmación escrita para evitar borrados accidentales.
 *
 * @throws Error si la confirmación no coincide
 */
export async function deleteMyAccount(confirmation: string, accountService: IAccountService): Promise<void> {
  if (confirmation.trim().toUpperCase() !== DELETE_ACCOUNT_CONFIRMATION) {
    throw new Error(`Escribe ${DELETE_ACCOUNT_CONFIRMATION} para confirmar`)
  }

  await accountService.deleteAccount()
}
