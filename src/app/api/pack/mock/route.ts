// src/app/api/pack/mock/route.ts

import { NextResponse } from 'next/server'
import { generatePackRequestSchema } from '@/lib/schemas/generate-pack-request.schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = generatePackRequestSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    )
  }
}
