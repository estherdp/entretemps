// tests/lib/safe-redirect.test.ts

import { describe, it, expect } from 'vitest'
import { buildAuthCallbackUrl, getSafeRedirectPath } from '@/lib/safe-redirect'

describe('getSafeRedirectPath', () => {
  it('should accept internal paths', () => {
    expect(getSafeRedirectPath('/wizard/step-1')).toBe('/wizard/step-1')
  })

  it('should reject external or protocol-relative URLs', () => {
    expect(getSafeRedirectPath('https://evil.test')).toBe('/')
    expect(getSafeRedirectPath('//evil.test')).toBe('/')
    expect(getSafeRedirectPath('/\\evil.test')).toBe('/')
    expect(getSafeRedirectPath(null)).toBe('/')
  })
})

describe('buildAuthCallbackUrl', () => {
  it('should keep the destination only when it is not the home page', () => {
    expect(buildAuthCallbackUrl('http://localhost:3000')).toBe('http://localhost:3000/auth/callback')
    expect(buildAuthCallbackUrl('http://localhost:3000', '/account')).toBe(
      'http://localhost:3000/auth/callback?next=%2Faccount'
    )
  })
})
