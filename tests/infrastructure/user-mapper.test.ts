// tests/infrastructure/user-mapper.test.ts

import { describe, it, expect } from 'vitest'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { toDomainUser } from '@/infrastructure/supabase/user-mapper'
import { getUserGreetingName } from '@/domain/user'

const baseUser = {
  id: 'user-1',
  email: 'ana@example.com',
  app_metadata: { provider: 'email' },
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2026-01-01T00:00:00Z',
} as SupabaseUser

describe('toDomainUser', () => {
  it('should prefer the chosen display name over the Google name', () => {
    const user = toDomainUser({
      ...baseUser,
      app_metadata: { provider: 'google' },
      user_metadata: { display_name: 'Ana', full_name: 'Ana García López' },
    })

    expect(user).toEqual({ id: 'user-1', email: 'ana@example.com', displayName: 'Ana', provider: 'google' })
  })

  it('should fall back to the Google name and then to null', () => {
    expect(toDomainUser({ ...baseUser, user_metadata: { full_name: 'Ana García' } }).displayName).toBe('Ana García')
    expect(toDomainUser(baseUser).displayName).toBeNull()
    expect(toDomainUser(baseUser).provider).toBe('email')
  })
})

describe('getUserGreetingName', () => {
  it('should use the email local part when there is no display name', () => {
    expect(getUserGreetingName({ id: '1', email: 'ana@example.com' })).toBe('ana')
    expect(getUserGreetingName({ id: '1', email: 'ana@example.com', displayName: 'Ana' })).toBe('Ana')
  })
})
