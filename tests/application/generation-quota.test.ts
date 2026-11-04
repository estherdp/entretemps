// tests/application/generation-quota.test.ts

import { describe, it, expect, vi } from 'vitest'
import { assertGenerationQuota, getGenerationUsage, parseQuotaLimit } from '@/application/generation-quota'
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

describe('getGenerationUsage', () => {
  it('should return usage per kind without negative remaining', async () => {
    const repo: IGenerationUsageRepository = {
      countSince: vi.fn().mockImplementation(async (_userId, kind) => (kind === 'adventure' ? 7 : 3)),
      record: vi.fn(),
    }

    const usage = await getGenerationUsage('user-1', { adventure: 5, mission: 20 }, repo)

    expect(usage.adventure).toEqual({ used: 7, limit: 5, remaining: 0 })
    expect(usage.mission).toEqual({ used: 3, limit: 20, remaining: 17 })
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
