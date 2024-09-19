/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getPayload } from '../../payload/payload.config'

async function handler(req: NextRequest): Promise<NextResponse> {
  try {
    await getPayload()
    // Use nextHandler from payload/next
    return nextHandler(req)
  } catch (error: unknown) {
    console.error('Error in Payload request handler:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler

export const dynamic = 'force-dynamic'

function nextHandler(
  _req: NextRequest,
): NextResponse<unknown> | PromiseLike<NextResponse<unknown>> {
  throw new Error('Function not implemented.')
}
