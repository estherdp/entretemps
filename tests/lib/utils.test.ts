import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('px-4', 'py-2')
    expect(result).toBe('px-4 py-2')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn('base', isActive && 'active')
    expect(result).toBe('base active')
  })

  it('should resolve Tailwind conflicts', () => {
    const result = cn('px-4', 'px-6')
    expect(result).toBe('px-6')
  })

  it('should handle undefined and false values', () => {
    const result = cn('base', undefined, false, 'end')
    expect(result).toBe('base end')
  })
})
