import { describe, it, expect } from 'vitest'
import { getUserGreetingName, getUserShortName, type User } from '@/domain/user'

const user = (overrides: Partial<User>): User => ({ id: 'u1', email: 'esther.dols@example.com', ...overrides })

describe('getUserShortName', () => {
  it('usa la primera palabra del nombre visible', () => {
    expect(getUserShortName(user({ displayName: 'Esther Dols' }))).toBe('Esther')
  })

  it('sin nombre, usa la primera parte del email', () => {
    expect(getUserGreetingName(user({}))).toBe('esther.dols')
    expect(getUserShortName(user({}))).toBe('esther')
  })

  it('mantiene un nombre de una sola palabra entero', () => {
    expect(getUserShortName(user({ displayName: 'Maximiliana' }))).toBe('Maximiliana')
  })
})
