/**
 * Validación de pasos del wizard
 * Centraliza todas las reglas de validación para garantizar coherencia
 */

import type { WizardData } from '@/domain/wizard-data'

export interface ValidationResult {
  isValid: boolean
  message?: string
}

/**
 * Step 1: Ocasión obligatoria
 */
export function validateStep1(data: WizardData): ValidationResult {
  if (!data.occasion) {
    return {
      isValid: false,
      message: 'Selecciona una ocasión para continuar',
    }
  }
  return { isValid: true }
}

/**
 * Step 2: Edades y número de niños
 * - edad mínima y máxima obligatorias
 * - edad mínima < edad máxima
 * - número de niños ≥ 1
 */
export function validateStep2(data: WizardData): ValidationResult {
  if (!data.ages) {
    return {
      isValid: false,
      message: 'Indica el rango de edades',
    }
  }

  const { min, max } = data.ages

  if (min === undefined || min === null || max === undefined || max === null) {
    return {
      isValid: false,
      message: 'Completa el rango de edades',
    }
  }

  if (min < 0 || max < 0) {
    return {
      isValid: false,
      message: 'Las edades deben ser números positivos',
    }
  }

  if (min >= max) {
    return {
      isValid: false,
      message: 'La edad mínima debe ser menor que la máxima',
    }
  }

  if (!data.kidsCount || data.kidsCount < 1) {
    return {
      isValid: false,
      message: 'Indica cuántos niños participarán (mínimo 1)',
    }
  }

  return { isValid: true }
}

/**
 * Step 3: Intereses no vacío
 */
export function validateStep3(data: WizardData): ValidationResult {
  if (!data.interests || data.interests.trim().length === 0) {
    return {
      isValid: false,
      message: 'Escribe al menos un interés o tema',
    }
  }

  return { isValid: true }
}

/**
 * Step 4: Lugar obligatorio
 */
export function validateStep4(data: WizardData): ValidationResult {
  if (!data.place) {
    return {
      isValid: false,
      message: 'Selecciona dónde se realizará la aventura',
    }
  }

  return { isValid: true }
}

/**
 * Step 5: Tipo, tono y dificultad obligatorios
 */
export function validateStep5(data: WizardData): ValidationResult {
  if (!data.adventureType) {
    return {
      isValid: false,
      message: 'Selecciona un tipo de aventura',
    }
  }

  if (!data.tone) {
    return {
      isValid: false,
      message: 'Selecciona el tono de la aventura',
    }
  }

  if (!data.difficulty) {
    return {
      isValid: false,
      message: 'Selecciona el nivel de dificultad',
    }
  }

  return { isValid: true }
}

/**
 * Validación general de un step específico
 */
export function validateWizardStep(step: number, data: WizardData): ValidationResult {
  switch (step) {
    case 1:
      return validateStep1(data)
    case 2:
      return validateStep2(data)
    case 3:
      return validateStep3(data)
    case 4:
      return validateStep4(data)
    case 5:
      return validateStep5(data)
    default:
      return { isValid: true }
  }
}
