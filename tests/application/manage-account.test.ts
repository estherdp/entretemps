// tests/application/manage-account.test.ts

import { describe, it, expect, vi } from 'vitest'
import { deleteMyAccount, updateDisplayName } from '@/application/manage-account'
import type { IAccountService } from '@/domain/services'

const createService = (): IAccountService => ({
  updateDisplayName: vi.fn().mockResolvedValue(undefined),
  deleteAccount: vi.fn().mockResolvedValue(undefined),
})

describe('updateDisplayName', () => {
  it('should trim and collapse spaces before saving', async () => {
    const service = createService()

    const saved = await updateDisplayName('  Esther   Dols ', service)

    expect(saved).toBe('Esther Dols')
    expect(service.updateDisplayName).toHaveBeenCalledWith('Esther Dols')
  })

  it('should reject empty and too long names', async () => {
    const service = createService()

    await expect(updateDisplayName('   ', service)).rejects.toThrow('vacío')
    await expect(updateDisplayName('a'.repeat(41), service)).rejects.toThrow('40')
    expect(service.updateDisplayName).not.toHaveBeenCalled()
  })
})

describe('deleteMyAccount', () => {
  it('should delete the account when the confirmation matches', async () => {
    const service = createService()

    await deleteMyAccount('borrar', service)

    expect(service.deleteAccount).toHaveBeenCalledTimes(1)
  })

  it('should not delete the account without the confirmation', async () => {
    const service = createService()

    await expect(deleteMyAccount('si', service)).rejects.toThrow('BORRAR')
    expect(service.deleteAccount).not.toHaveBeenCalled()
  })
})
