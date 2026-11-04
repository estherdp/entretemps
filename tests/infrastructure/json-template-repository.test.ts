import { describe, it, expect } from 'vitest'
import { JsonTemplateRepository, parseTemplates } from '@/infrastructure/templates/json-template-repository'
import { listTemplates } from '@/application/list-templates'
import { getTemplateById } from '@/application/get-template-by-id'

describe('JsonTemplateRepository (catálogo real)', () => {
  const repository = new JsonTemplateRepository()
  const templates = repository.list()

  it('carga y valida todas las plantillas del JSON', () => {
    expect(templates.length).toBeGreaterThanOrEqual(6)
  })

  it('usa ids únicos', () => {
    const ids = templates.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('todas las misiones son jugables: reto, pistas y tarjetas', () => {
    for (const template of templates) {
      for (const mission of template.missions) {
        expect(mission.challenge?.solution, `${template.id} #${mission.order}`).toBeTruthy()
        expect(mission.hints?.length).toBeGreaterThan(0)
        expect(mission.clueCards?.length).toBeGreaterThan(0)
      }
    }
  })

  it('numera las misiones de forma consecutiva desde 1', () => {
    for (const template of templates) {
      const orders = template.missions.map((m) => m.order)
      expect(orders).toEqual(orders.map((_, i) => i + 1))
    }
  })

  it('cubre todos los tipos de aventura', () => {
    const types = new Set(templates.map((t) => t.adventureType))
    expect(types).toEqual(new Set(['mystery', 'adventure', 'fantasy', 'action', 'humor']))
  })

  it('getById devuelve la plantilla o null', () => {
    const first = templates[0]
    expect(getTemplateById(first.id, repository)).toEqual(first)
    expect(getTemplateById('no-existe', repository)).toBeNull()
  })

  it('listTemplates expone solo los datos del listado', () => {
    const [item] = listTemplates(repository)
    expect(Object.keys(item).sort()).toEqual(
      ['adventureType', 'ageRange', 'difficulty', 'estimatedDurationMinutes', 'id', 'place', 'title'].sort()
    )
  })
})

describe('parseTemplates', () => {
  it('rechaza una plantilla sin campos jugables', () => {
    const [valid] = new JsonTemplateRepository().list()
    const { challenge: _challenge, ...missionWithoutChallenge } = valid.missions[0]
    void _challenge
    const broken = { ...valid, missions: [missionWithoutChallenge] }

    expect(() => parseTemplates([broken])).toThrow()
  })

  it('rechaza ids que no son slugs', () => {
    const [valid] = new JsonTemplateRepository().list()
    expect(() => parseTemplates([{ ...valid, id: 'Con Espacios' }])).toThrow()
  })
})
