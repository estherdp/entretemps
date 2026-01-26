import { describe, it, expect } from 'vitest'
import { POST } from '@/app/api/pack/mock/route'

const createRequest = (body: unknown) =>
  new Request('http://localhost/api/pack/mock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('POST /api/pack/mock', () => {
  it('should return 204 for a valid request', async () => {
    const validRequest = {
      locale: 'es',
      wizardData: {
        occasion: 'birthday',
        ages: { min: 6, max: 10 },
        kidsCount: 8,
        interests: 'Dinosaurios',
        place: 'home',
        adventureType: 'mystery',
        tone: 'funny',
        difficulty: 'easy',
      },
      constraints: {
        phases: 3,
        puzzlesPerPhase: 2,
        screenFree: true,
      },
    }

    const response = await POST(createRequest(validRequest))

    expect(response.status).toBe(204)
  })

  it('should return 400 for an invalid request', async () => {
    const invalidRequest = {
      locale: 'es',
      // missing wizardData and constraints
    }

    const response = await POST(createRequest(invalidRequest))

    expect(response.status).toBe(400)
  })
})
