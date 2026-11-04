// tests/application/generation-quota.test.ts

import { describe, it, expect, vi } from 'vitest'
import { assertGenerationQuota, parseQuotaLimit } from '@/application/generation-quota'
import { UserQuotaExceededError } from '@/domain/errors'
import type { IGenerationUsageRepository } from '@/domain/repositories'

const createRepo = (used: number): IGenerationUsageRepository => ({
  countSince: vi.fn().mockResolvedValue(used),
  record: vi.fn(),
})

describe('assertGenerationQuota', () => {
  it('should return remaining generations when under the limit', async () => {
    const status = await assertGenerationQuota('user-1', 'adventure', 5, createRepo(2))

    expect(status).toEqual({ used: 2, limit: 5, remaining: 3 })
  })

  it('should throw UserQuotaExceededError when the limit is reached', async () => {
    await expect(assertGenerationQuota('user-1', 'adventure', 5, createRepo(5))).rejects.toBeInstanceOf(
      UserQuotaExceededError
    )
  })

  it('should count usage in a rolling 24h window', async () => {
    const repo = createRepo(0)
    const now = new Date('2026-11-04T12:00:00Z')

    await assertGenerationQuota('user-1', 'mission', 20, repo, now)

    expect(repo.countSince).toHaveBeenCalledWith('user-1', 'mission', new Date('2026-11-03T12:00:00Z'))
  })
})

describe('parseQuotaLimit', () => {
  it('should parse valid numbers and fall back otherwise', () => {
    expect(parseQuotaLimit('10', 5)).toBe(10)
    expect(parseQuotaLimit(undefined, 5)).toBe(5)
    expect(parseQuotaLimit('abc', 5)).toBe(5)
    expect(parseQuotaLimit('-1', 5)).toBe(5)
  })
})
