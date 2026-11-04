import { describe, it, expect, vi } from 'vitest'
import { saveTemplateAsMyPack } from '@/application/save-template-as-my-pack'
import { JsonTemplateRepository } from '@/infrastructure/templates/json-template-repository'
import type { IAdventurePackRepository } from '@/domain/repositories'

describe('saveTemplateAsMyPack', () => {
  it('guarda una copia con id propio y fecha actual', async () => {
    const template = new JsonTemplateRepository().list()[0]
    const save = vi.fn().mockImplementation(async (params) => ({ id: 'saved-1', ...params }))
    const repository = { save } as unknown as IAdventurePackRepository

    await saveTemplateAsMyPack('user-1', template, repository)

    const { userId, title, pack } = save.mock.calls[0][0]
    expect(userId).toBe('user-1')
    expect(title).toBe(template.title)
    expect(pack.id).not.toBe(template.id)
    expect(pack.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(pack.createdAt).not.toBe(template.createdAt)
    expect(pack.missions).toEqual(template.missions)
  })
})
