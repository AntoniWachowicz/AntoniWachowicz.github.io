import { NextResponse } from 'next/server'

export function middleware(): NextResponse {
  const response = NextResponse.next()

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Origin', '*') // Be more specific in production
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )

  return response
}

export const config = {
  matcher: '/api/:path*',
}
