import { describe, it, expect } from 'vitest'
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
  validateWizardStep,
} from '@/application/validate-wizard-step'
import { WizardData } from '@/domain/wizard-data'

describe('validateWizardStep', () => {
  describe('validateStep1', () => {
    it('should return valid when occasion is selected', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: 'dinosaurios',
        place: 'casa',
        adventureType: 'misterio',
        tone: 'divertido',
        difficulty: 'fácil',
      }

      const result = validateStep1(data)

      expect(result.isValid).toBe(true)
      expect(result.message).toBeUndefined()
    })

    it('should return invalid when occasion is not selected', () => {
      const data: WizardData = {
        occasion: '',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: 'dinosaurios',
        place: 'casa',
        adventureType: 'misterio',
        tone: 'divertido',
        difficulty: 'fácil',
      }

      const result = validateStep1(data)

      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Selecciona una ocasión para continuar')
    })
  })

  describe('validateStep2', () => {
    it('should return valid when ages and kidsCount are correct', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: '',
        place: '',
        adventureType: '',
        tone: '',
        difficulty: '',
      }

      const result = validateStep2(data)

      expect(result.isValid).toBe(true)
      expect(result.message).toBeUndefined()
    })

    it('should return invalid when min age is greater than max age', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 10, max: 5 },
        kidsCount: 2,
        interests: '',
        place: '',
        adventureType: '',
        tone: '',
        difficulty: '',
      }

      const result = validateStep2(data)

      expect(result.isValid).toBe(false)
      expect(result.message).toContain('superar')
    })

    it('should return invalid when kidsCount is less than 1', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 0,
        interests: '',
        place: '',
        adventureType: '',
        tone: '',
        difficulty: '',
      }

      const result = validateStep2(data)

      expect(result.isValid).toBe(false)
      expect(result.message).toContain('mínimo 1')
    })

    it('should return invalid when ages are not defined', () => {
      const data: WizardData = {
        occasion: 'cumpleaños' as any,
        ages: undefined,
        kidsCount: 2,
        interests: '',
        place: '',
        adventureType: '',
        tone: '',
        difficulty: '',
      }

      const result = validateStep2(data)

      expect(result.isValid).toBe(false)
      expect(result.message).toContain('edad')
    })
  })

  describe('validateStep3', () => {
    it('should return valid when interests are provided', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: 'dinosaurios, ciencia',
        place: '',
        adventureType: '',
        tone: '',
        difficulty: '',
      }

      const result = validateStep3(data)

      expect(result.isValid).toBe(true)
      expect(result.message).toBeUndefined()
    })

    it('should return invalid when interests are empty', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: '',
        place: '',
        adventureType: '',
        tone: '',
        difficulty: '',
      }

      const result = validateStep3(data)

      expect(result.isValid).toBe(false)
      expect(result.message).toContain('interés')
    })

    it('should return invalid when interests are only whitespace', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: '   ',
        place: '',
        adventureType: '',
        tone: '',
        difficulty: '',
      }

      const result = validateStep3(data)

      expect(result.isValid).toBe(false)
      expect(result.message).toContain('interés')
    })
  })

  describe('validateStep4', () => {
    it('should return valid when place is selected', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: 'dinosaurios',
        place: 'casa',
        adventureType: '',
        tone: '',
        difficulty: '',
      }

      const result = validateStep4(data)

      expect(result.isValid).toBe(true)
      expect(result.message).toBeUndefined()
    })

    it('should return invalid when place is not selected', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: 'dinosaurios',
        place: '',
        adventureType: '',
        tone: '',
        difficulty: '',
      }

      const result = validateStep4(data)

      expect(result.isValid).toBe(false)
      expect(result.message).toContain('dónde se realizará')
    })
  })

  describe('validateStep5', () => {
    it('should return valid when all selections are made', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: 'dinosaurios',
        place: 'casa',
        adventureType: 'misterio',
        tone: 'divertido',
        difficulty: 'fácil',
      }

      const result = validateStep5(data)

      expect(result.isValid).toBe(true)
      expect(result.message).toBeUndefined()
    })

    it('should return invalid when adventureType is not selected', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: 'dinosaurios',
        place: 'casa',
        adventureType: '',
        tone: 'divertido',
        difficulty: 'fácil',
      }

      const result = validateStep5(data)

      expect(result.isValid).toBe(false)
      expect(result.message).toContain('tipo de aventura')
    })

    it('should return invalid when tone is not selected', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: 'dinosaurios',
        place: 'casa',
        adventureType: 'misterio',
        tone: '',
        difficulty: 'fácil',
      }

      const result = validateStep5(data)

      expect(result.isValid).toBe(false)
      expect(result.message).toContain('tono')
    })

    it('should return invalid when difficulty is not selected', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: 'dinosaurios',
        place: 'casa',
        adventureType: 'misterio',
        tone: 'divertido',
        difficulty: '',
      }

      const result = validateStep5(data)

      expect(result.isValid).toBe(false)
      expect(result.message).toContain('dificultad')
    })
  })

  describe('validateWizardStep', () => {
    it('should dispatch to correct validation function based on step number', () => {
      const data: WizardData = {
        occasion: '',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: '',
        place: '',
        adventureType: '',
        tone: '',
        difficulty: '',
      }

      const result1 = validateWizardStep(1, data)
      expect(result1.isValid).toBe(false)
      expect(result1.message).toContain('ocasión')

      const result2 = validateWizardStep(2, { ...data, occasion: 'cumpleaños' })
      expect(result2.isValid).toBe(true)

      const result3 = validateWizardStep(3, { ...data, occasion: 'cumpleaños' })
      expect(result3.isValid).toBe(false)
      expect(result3.message).toContain('interés')

      const result4 = validateWizardStep(4, { ...data, occasion: 'cumpleaños', interests: 'test' })
      expect(result4.isValid).toBe(false)
      expect(result4.message).toContain('dónde se realizará')

      const result5 = validateWizardStep(5, {
        ...data,
        occasion: 'cumpleaños',
        interests: 'test',
        place: 'casa',
      })
      expect(result5.isValid).toBe(false)
      expect(result5.message).toContain('tipo de aventura')
    })

    it('should return valid for unknown step numbers', () => {
      const data: WizardData = {
        occasion: 'cumpleaños',
        ages: { min: 5, max: 10 },
        kidsCount: 2,
        interests: 'test',
        place: 'casa',
        adventureType: 'misterio',
        tone: 'divertido',
        difficulty: 'fácil',
      }

      const result = validateWizardStep(99, data)
      expect(result.isValid).toBe(true)
      expect(result.message).toBeUndefined()
    })
  })
})
